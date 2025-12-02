// Đánh dấu đây là "Client Component"
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
import { doc, onSnapshot, updateDoc, Timestamp, DocumentData, serverTimestamp, collection, query, getDocs, where } from 'firebase/firestore'
import ProtectedRoute from '../../../components/ProtectedRoute'
import styles from './page.module.css'
import { FaClock, FaPaperPlane, FaFileExport, FaCheckSquare, FaSquare, FaPlusCircle, FaBan, FaRedo } from 'react-icons/fa'

// (Định nghĩa "kiểu")
interface ExamRoom {
  id: string;
  license_id: string;
  license_name: string;
  room_name: string;
  teacher_name: string;
  status: 'waiting' | 'in_progress' | 'finished';
  created_at: Timestamp;
  exam_data?: any; // Dữ liệu đề thi (để lấy thời gian làm bài)
  password?: string; // Mật khẩu phòng
  is_paused?: boolean; // Trạng thái tạm dừng
}

interface Participant {
  id: string;
  fullName: string;
  email: string;
  status: 'waiting' | 'in_progress' | 'submitted' | 'kicked';
  score?: number;
  totalQuestions?: number;
  joinedAt: Timestamp;
  startedAt?: Timestamp; // Thời điểm bắt đầu làm bài
  submittedAt?: Timestamp; // Thời điểm nộp bài
  extraTime?: number; // Thời gian cộng thêm (phút)
  birthDate?: string; // Ngày sinh
  address?: string; // Địa chỉ
  violationCount?: number; // Số lần vi phạm (chuyển tab)
}

// --- Component "Nội dung" (Bên trong "Lính gác") ---
function RoomControlDashboard() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const roomId = params.roomId as string

  // (Não trạng thái)
  const [room, setRoom] = useState<ExamRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isStarting, setIsStarting] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])

  // State mới cho các chức năng nâng cao
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [currentTime, setCurrentTime] = useState(Date.now())

  // (Phép thuật 1: Lắng nghe Phòng thi)
  useEffect(() => {
    if (!roomId || !user) return
    const roomRef = doc(db, 'exam_rooms', roomId)
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const roomData = { id: docSnap.id, ...docSnap.data() } as ExamRoom
        setRoom(roomData)
        setLoading(false)
      } else {
        setError('Không tìm thấy phòng thi này!')
        setLoading(false)
      }
    }, (err) => {
      setError('Lỗi kết nối thời gian thực.')
      setLoading(false)
    })
    return () => unsubscribe()
  }, [roomId, user])


  // (Phép thuật 2: Lắng nghe Học viên & Lấy thông tin chi tiết)
  useEffect(() => {
    if (!roomId) return;
    const participantsRef = collection(db, 'exam_rooms', roomId, 'participants');
    const q = query(participantsRef);
    const unsubscribe = onSnapshot(q,
      async (querySnapshot) => {
        const participantList: Participant[] = [];
        const userIds: string[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          participantList.push({ id: doc.id, ...data } as Participant);
          userIds.push(doc.id);
        });

        // Fetch user details (birthDate, address) if we have participants
        if (userIds.length > 0) {
          try {
            // Fetching all users is heavy. Let's fetch individually for now or use a map if we had a user cache.
            // Given the constraints, let's try to fetch all users and map.
            const usersRef = collection(db, 'users');
            // Optimization: In a real app, use 'where documentId in [...]' with batches.
            // Here, we'll fetch all users to map. (Not ideal for large DB but works for MVP)
            const usersSnapshot = await getDocs(usersRef);
            const userMap: Record<string, any> = {};
            usersSnapshot.forEach(doc => {
              userMap[doc.id] = doc.data();
            });

            // Merge data
            participantList.forEach(p => {
              if (userMap[p.id]) {
                p.birthDate = userMap[p.id].birthDate;
                p.address = userMap[p.id].address;
              }
            });
          } catch (err) {
            console.error("Error fetching user details:", err);
          }
        }

        setParticipants(participantList);
      },
      (err) => {
        console.error('[GV] Lỗi khi "lắng nghe" participants:', err)
        setError('Lỗi kết nối Dashboard thời gian thực.')
      }
    );
    return () => unsubscribe();
  }, [roomId]);

  // (Phép thuật 3: Đồng hồ đếm ngược)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])


  // (Hàm "Phát đề" - Có chọn lọc)
  const handleStartExam = async () => {
    if (!room) return

    // Nếu có chọn học viên -> Chỉ phát cho người được chọn
    // Nếu KHÔNG chọn ai -> Hỏi có muốn phát cho TẤT CẢ (đang chờ) không?
    let targetIds: string[] = [];
    if (selectedIds.size > 0) {
      targetIds = Array.from(selectedIds);
    } else {
      if (!confirm('Bạn chưa chọn học viên nào. Bạn có muốn phát đề cho TẤT CẢ học viên đang chờ không?')) return;
      targetIds = participants.filter(p => p.status === 'waiting').map(p => p.id);
    }

    if (targetIds.length === 0) {
      alert('Không có học viên nào để phát đề.');
      return;
    }

    setIsStarting(true)
    setError(null)
    try {
      // 1. Lấy đề thi (nếu chưa có)
      let examData = room.exam_data;
      if (!examData) {
        const res = await fetch(`/api/thi/${room.license_id}`)
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || `Lỗi máy chủ: ${res.status}`)
        }
        examData = await res.json()

        // Cập nhật đề vào phòng (chỉ làm 1 lần)
        const roomRef = doc(db, 'exam_rooms', roomId)
        await updateDoc(roomRef, {
          status: 'in_progress',
          exam_data: examData,
          started_at: serverTimestamp()
        })
      }

      // 2. Cập nhật trạng thái cho các học viên được chọn
      const updatePromises = targetIds.map(id => {
        const participantRef = doc(db, 'exam_rooms', roomId, 'participants', id);
        return updateDoc(participantRef, {
          status: 'in_progress',
          startedAt: serverTimestamp()
        });
      });

      await Promise.all(updatePromises);
      console.log(`[GV] Đã phát đề cho ${targetIds.length} học viên.`)
      setSelectedIds(new Set()); // Clear selection

    } catch (err: any) {
      console.error('[GV] Lỗi khi "phát đề":', err)
      setError(err.message)
    } finally {
      setIsStarting(false)
    }
  }

  // --- CÁC HÀM XỬ LÝ MỚI ---

  // 1. Chọn / Bỏ chọn học viên
  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    setSelectedIds(newSet)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === participants.length) {
      setSelectedIds(new Set())
    } else {
      const allIds = new Set(participants.map(p => p.id))
      setSelectedIds(allIds)
    }
  }

  // 2. Nộp bài hộ (Force Submit)
  const handleForceSubmit = async (ids: string[]) => {
    if (!confirm(`Bạn có chắc muốn THU BÀI của ${ids.length} học viên này ngay lập tức?`)) return

    try {
      const updatePromises = ids.map(id => {
        const ref = doc(db, 'exam_rooms', roomId, 'participants', id)
        return updateDoc(ref, { status: 'submitted' })
      })
      await Promise.all(updatePromises)
      alert('Đã thu bài thành công!')
      setSelectedIds(new Set()) // Clear selection
    } catch (err: any) {
      console.error("Lỗi thu bài:", err)
      alert('Lỗi khi thu bài: ' + err.message)
    }
  }

  // 3. Cộng giờ (Add Time)
  const handleAddTime = async (ids: string[]) => {
    const minutesStr = prompt(`Nhập số phút muốn cộng thêm cho ${ids.length} học viên:`, '5')
    if (!minutesStr) return
    const minutes = parseInt(minutesStr)
    if (isNaN(minutes) || minutes <= 0) {
      alert('Vui lòng nhập số phút hợp lệ!')
      return
    }

    try {
      const updatePromises = ids.map(async (id) => {
        const p = participants.find(user => user.id === id)
        const currentExtra = p?.extraTime || 0

        const ref = doc(db, 'exam_rooms', roomId, 'participants', id)
        return updateDoc(ref, { extraTime: currentExtra + minutes })
      })
      await Promise.all(updatePromises)
      alert(`Đã cộng thêm ${minutes} phút thành công!`)
      setSelectedIds(new Set())
    } catch (err: any) {
      console.error("Lỗi cộng giờ:", err)
      alert('Lỗi khi cộng giờ: ' + err.message)
    }
  }

  // 4. Xuất Excel (CSV) - Chi tiết
  const handleExportExcel = () => {
    // Sắp xếp theo tên (A-Z)
    const sortedParticipants = [...participants].sort((a, b) => a.fullName.localeCompare(b.fullName));

    // Header Info
    const fileTitle = `DANH SÁCH KẾT QUẢ THI`;
    const roomInfo = `Lớp: ${room?.room_name} - Hạng: ${room?.license_name}`;
    const dateInfo = `Ngày thi: ${new Date().toLocaleDateString('vi-VN')}`;
    const countInfo = `Số lượng: ${participants.length} học viên`;

    // Table Header
    const headers = ['STT', 'Họ và Tên', 'Ngày sinh', 'Địa chỉ', 'Trạng thái', 'Điểm số', 'Thời gian làm bài (phút)', 'Số lần vi phạm'];

    // Rows
    const rows = sortedParticipants.map((p, index) => {
      // Tính thời gian làm bài thực tế
      let timeTaken = '';
      if (p.startedAt && p.submittedAt) {
        const diffMs = p.submittedAt.toMillis() - p.startedAt.toMillis();
        const diffMins = Math.floor(diffMs / 60000);
        const diffSecs = Math.floor((diffMs % 60000) / 1000);
        timeTaken = `${diffMins}p ${diffSecs}s`;
      }

      return [
        index + 1,
        p.fullName,
        p.birthDate ? new Date(p.birthDate).toLocaleDateString('vi-VN') : '',
        p.address || '',
        p.status === 'waiting' ? 'Đang chờ' : p.status === 'in_progress' ? 'Đang thi' : 'Đã nộp',
        p.score !== undefined ? p.score : '',
        timeTaken,
        p.violationCount || 0
      ];
    });

    // Combine Content
    const csvContent = [
      `\uFEFF${fileTitle}`,
      roomInfo,
      dateInfo,
      countInfo,
      '', // Empty line
      headers.join(','),
      ...rows.map(row => row.map(item => `"${item}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `KetQuaThi_${room?.room_name}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 5. Tạm dừng / Tiếp tục
  const handleTogglePause = async () => {
    if (!room) return;
    const newStatus = !room.is_paused;
    const confirmMsg = newStatus
      ? 'Bạn có chắc muốn TẠM DỪNG bài thi? (Học viên sẽ không thể làm bài tiếp)'
      : 'Bạn có chắc muốn TIẾP TỤC bài thi?';
    if (!confirm(confirmMsg)) return;

    try {
      await updateDoc(doc(db, 'exam_rooms', roomId), { is_paused: newStatus });
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // 6. Cập nhật mật khẩu
  const handleUpdatePassword = async () => {
    const newPass = prompt('Nhập mật khẩu mới cho phòng (Để trống để xóa mật khẩu):', room?.password || '');
    if (newPass === null) return; // Cancelled

    try {
      await updateDoc(doc(db, 'exam_rooms', roomId), { password: newPass });
      alert('Đã cập nhật mật khẩu!');
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // 7. Kick học viên
  const handleKick = async (id: string) => {
    if (!confirm('Bạn có chắc muốn MỜI học viên này ra khỏi phòng?')) return;
    try {
      await updateDoc(doc(db, 'exam_rooms', roomId, 'participants', id), { status: 'kicked' });
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // 8. Reset bài thi (Cho thi lại)
  const handleReset = async (id: string) => {
    if (!confirm('CẢNH BÁO: Hành động này sẽ XÓA TOÀN BỘ kết quả và cho phép học viên thi lại từ đầu. Bạn có chắc chắn không?')) return;
    try {
      // Dùng deleteField() nếu muốn xóa hẳn field, nhưng ở đây set null/undefined cho đơn giản với type
      await updateDoc(doc(db, 'exam_rooms', roomId, 'participants', id), {
        status: 'waiting',
        startedAt: null,
        submittedAt: null,
        score: null,
        violationCount: 0,
        extraTime: 0
      });
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  // Helper: Tính thời gian còn lại
  const calculateTimeRemaining = (p: Participant) => {
    if (p.status !== 'in_progress' || !p.startedAt || !room?.exam_data?.duration) return null

    // Duration in minutes -> ms
    const durationMs = room.exam_data.duration * 60 * 1000
    const extraMs = (p.extraTime || 0) * 60 * 1000
    const endTime = p.startedAt.toMillis() + durationMs + extraMs
    const remaining = endTime - currentTime

    if (remaining <= 0) return "00:00"

    const m = Math.floor(remaining / 60000)
    const s = Math.floor((remaining % 60000) / 1000)
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }


  // 5. GIAO DIỆN

  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Đang tải phòng điều khiển...</h1>
      </div>
    )
  }
  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.titleError}>Lỗi: {error}</h1>
      </div>
    )
  }
  if (!room) return null;

  return (
    <div className={styles.container}>
      {/* (Thông tin phòng) */}
      <h1 className={styles.title}>
        Phòng: {room.room_name}
      </h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p className={styles.info}>
            <span className={styles.label}>Hạng thi:</span> {room.license_name}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>Giáo viên:</span> {room.teacher_name}
          </p>
          <p className={styles.info}>
            <span className={styles.label}>ID Phòng:</span> {room.id}
          </p>
        </div>
        {/* Nút Xuất Excel */}
        <button onClick={handleExportExcel} className={styles.buttonExport} title="Xuất kết quả ra Excel">
          <FaFileExport /> Xuất Excel
        </button>
      </div>

      {/* Trạng thái và Nút Bấm */}
      <div className={styles.statusBox}>
        <div className={styles.statusLeft}>
          <h2 className={styles.label}>Trạng thái</h2>
          {room.status === 'waiting' && (
            <p className={`${styles.status} ${styles.statusWaiting}`}>ĐANG CHỜ</p>
          )}
          {room.status === 'in_progress' && (
            <p className={`${styles.status} ${styles.statusInProgress}`}>ĐANG THI</p>
          )}
          {room.status === 'finished' && (
            <p className={`${styles.status} ${styles.statusFinished}`}>ĐÃ KẾT THÚC</p>
          )}
        </div>

        <div className={styles.statusRight}>
          {room.status === 'waiting' && (
            <button
              onClick={handleStartExam}
              disabled={isStarting}
              className={`${styles.button} ${styles.buttonStart}`}
            >
              {isStarting ? 'Đang trộn đề...' : 'BẮT ĐẦU PHÁT ĐỀ'}
            </button>
          )}
        </div>
      </div>

      {/* CÀI ĐẶT NÂNG CAO */}
      <div className={styles.statusBox} style={{ marginTop: '1rem', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd' }}>
        <div className={styles.statusLeft}>
          <h2 className={styles.label} style={{ color: '#0284c7' }}>Điều khiển & Bảo mật</h2>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <p><strong>Mật khẩu:</strong> {room.password || '(Không có)'}</p>
            <p><strong>Trạng thái thi:</strong> {room.is_paused ? <span style={{ color: 'red', fontWeight: 'bold' }}>ĐANG TẠM DỪNG</span> : <span style={{ color: 'green', fontWeight: 'bold' }}>BÌNH THƯỜNG</span>}</p>
          </div>
        </div>
        <div className={styles.statusRight} style={{ gap: '10px' }}>
          <button onClick={handleUpdatePassword} className={styles.button} style={{ backgroundColor: '#0ea5e9' }}>
            🔑 Đổi mật khẩu
          </button>
          <button onClick={handleTogglePause} className={styles.button} style={{ backgroundColor: room.is_paused ? '#22c55e' : '#f59e0b' }}>
            {room.is_paused ? '▶️ Tiếp tục thi' : '⏸️ Tạm dừng thi'}
          </button>
        </div>
      </div>

      {/* THANH CÔNG CỤ HÀNG LOẠT (Hiện khi có chọn) */}
      {selectedIds.size > 0 && (
        <div className={styles.bulkActions}>
          <span>Đã chọn {selectedIds.size} học viên:</span>
          <button onClick={() => handleForceSubmit(Array.from(selectedIds))} className={styles.bulkBtnSubmit}>
            <FaPaperPlane /> Thu bài ngay
          </button>
          <button onClick={() => handleAddTime(Array.from(selectedIds))} className={styles.bulkBtnTime}>
            <FaPlusCircle /> Cộng giờ
          </button>
        </div>
      )}

      {/* BẢNG LIVE DASHBOARD */}
      <div className={styles.dashboard}>
        <h2 className={styles.dashboardTitle}>
          Bảng điều khiển (Realtime) - ({participants.length} người tham gia)
        </h2>

        <table className={styles.participantTable}>
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <div onClick={toggleSelectAll} style={{ cursor: 'pointer' }}>
                  {participants.length > 0 && selectedIds.size === participants.length ? <FaCheckSquare /> : <FaSquare style={{ color: '#ddd' }} />}
                </div>
              </th>
              <th>Họ và Tên</th>
              <th>Năm sinh</th>
              <th>Trạng thái</th>
              <th>Thời gian còn lại</th>
              <th>Kết quả</th>
              <th>Ghi chú</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {participants.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center' }}>Đang chờ học viên vào phòng...</td>
              </tr>
            ) : (
              participants.map((p) => {
                const isSelected = selectedIds.has(p.id)
                const timeRemaining = calculateTimeRemaining(p)

                return (
                  <tr key={p.id} className={isSelected ? styles.rowSelected : ''}>
                    <td style={{ textAlign: 'center' }}>
                      <div onClick={() => toggleSelection(p.id)} style={{ cursor: 'pointer', color: isSelected ? '#1890ff' : '#ccc' }}>
                        {isSelected ? <FaCheckSquare /> : <FaSquare />}
                      </div>
                    </td>
                    <td>
                      <div><strong>{p.fullName}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.email}</div>
                    </td>
                    <td>
                      {p.birthDate ? new Date(p.birthDate).getFullYear() : '--'}
                    </td>
                    <td>
                      {p.status === 'waiting' && <span className={`${styles.pill} ${styles.pillWaiting}`}>Đang chờ</span>}
                      {p.status === 'in_progress' && <span className={`${styles.pill} ${styles.pillInProgress}`}>Đang thi</span>}
                      {p.status === 'submitted' && <span className={`${styles.pill} ${styles.pillSubmitted}`}>Đã nộp</span>}
                      {p.status === 'kicked' && <span className={`${styles.pill}`} style={{ backgroundColor: '#4b5563', color: 'white' }}>Đã mời ra</span>}
                    </td>
                    <td style={{ fontWeight: 'bold', color: timeRemaining === '00:00' ? 'red' : '#262626' }}>
                      {p.status === 'in_progress' ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <FaClock style={{ color: '#faad14' }} />
                          {timeRemaining || '--:--'}
                        </div>
                      ) : '--'}
                    </td>
                    <td>
                      {p.status === 'submitted' ? (
                        <strong>{p.score} / {p.totalQuestions}</strong>
                      ) : '...'}
                    </td>
                    <td style={{ color: 'red', fontWeight: 'bold' }}>
                      {p.violationCount && p.violationCount > 0 ? (
                        <span>⚠️ Chuyển tab: {p.violationCount} lần</span>
                      ) : ''}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleForceSubmit([p.id])}
                          title="Thu bài ngay"
                          disabled={p.status !== 'in_progress'}
                          className={styles.actionBtn}
                        >
                          <FaPaperPlane />
                        </button>
                        <button
                          onClick={() => handleAddTime([p.id])}
                          title="Cộng thêm giờ"
                          disabled={p.status !== 'in_progress'}
                          className={styles.actionBtn}
                        >
                          <FaPlusCircle />
                        </button>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '5px' }}>
                        <button
                          onClick={() => handleReset(p.id)}
                          title="Cho thi lại (Reset)"
                          className={styles.actionBtn}
                          style={{ backgroundColor: '#ef4444' }}
                        >
                          <FaRedo />
                        </button>
                        <button
                          onClick={() => handleKick(p.id)}
                          title="Mời ra khỏi phòng (Kick)"
                          className={styles.actionBtn}
                          style={{ backgroundColor: '#4b5563' }}
                        >
                          <FaBan />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

// --- Component "Vỏ Bọc" (Bảo vệ) ---
export default function QuanLyRoomPage() {
  return (
    <ProtectedRoute allowedRoles={['giao_vien', 'admin', 'lanh_dao']}>
      <RoomControlDashboard />
    </ProtectedRoute>
  )
}