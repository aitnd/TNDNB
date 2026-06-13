// Đánh dấu đây là "Client Component"
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'
import { db } from '../../../utils/firebaseClient'
import { doc, onSnapshot, updateDoc, collection, writeBatch, serverTimestamp} from 'firebase/firestore'  
import styles from './page.module.css'
import Link from 'next/link'

// (Định nghĩa kiểu dữ liệu)
interface Participant {
  id: string
  fullName: string
  email: string
  status: 'waiting' | 'in_progress' | 'submitted' | 'kicked'
  score?: number
  totalQuestions?: number
  joinedAt?: any
  violationCount?: number;
  startedAt?: any;
  isPaused?: boolean; // 💖 Trạng thái tạm dừng cá nhân
  lastPausedAt?: any; // 💖 Thời điểm bắt đầu tạm dừng
  totalPausedDuration?: number; // 💖 Tổng thời gian đã tạm dừng (ms)
}

interface ExamRoom {
  id: string
  room_name: string
  license_name: string
  teacher_name: string
  status: 'waiting' | 'in_progress' | 'finished'
  exam_data?: any
  duration?: number
  started_at?: any
  password?: string;
  is_paused?: boolean; // Tạm dừng toàn phòng
  auto_distribute?: boolean;
}

export default function TeacherRoomPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string

  const [room, setRoom] = useState<ExamRoom | null>(null)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  // STATE CHO BULK ACTIONS
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectAll, setIsSelectAll] = useState(false);

  // 1. Lắng nghe thông tin phòng
  useEffect(() => {
    if (!roomId) return
    const roomRef = doc(db, 'exam_rooms', roomId)
    const unsubscribe = onSnapshot(roomRef, (docSnap: any) => {
      if (docSnap.exists()) {
        setRoom({ id: docSnap.id, ...docSnap.data() } as ExamRoom)
      } else {
        alert('Phòng không tồn tại!')
        router.push('/quan-ly')
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [roomId, router])

  // 2. Lắng nghe danh sách học viên
  useEffect(() => {
    if (!roomId) return
    const participantsRef = collection(db, 'exam_rooms', roomId, 'participants')
    const unsubscribe = onSnapshot(participantsRef, (snapshot: any) => {
      const list = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Participant))
      setParticipants(list)
    })
    return () => unsubscribe()
  }, [roomId])

  // XỬ LÝ CHỌN CHECKBOX
  const handleSelectOne = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  }

  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedIds(new Set());
      setIsSelectAll(false);
    } else {
      const allIds = new Set(participants.map(p => p.id));
      setSelectedIds(allIds);
      setIsSelectAll(true);
    }
  }

  // 3. Bắt đầu làm bài (Phát đề)
  const handleStartExam = async () => {
    if (!room) return

    const confirmMsg = room.status === 'waiting'
      ? 'Bạn có chắc chắn muốn BẮT ĐẦU bài thi cho cả phòng?'
      : 'Bạn có muốn phát đề cho các học viên ĐANG CHỌN?';

    if (!confirm(confirmMsg)) return

    try {
      const batch = writeBatch(db);
      const roomRef = doc(db, 'exam_rooms', roomId);

      if (room.status === 'waiting') {
        batch.update(roomRef, {
          status: 'in_progress',
          started_at: serverTimestamp()
        });
        participants.forEach(p => {
          const pRef = doc(db, 'exam_rooms', roomId, 'participants', p.id);
          batch.update(pRef, { status: 'in_progress', startedAt: serverTimestamp() });
        });
      } else {
        if (selectedIds.size === 0) {
          alert('Vui lòng chọn học viên để phát đề (khi phòng đang diễn ra).');
          return;
        }
        selectedIds.forEach(pid => {
          const pRef = doc(db, 'exam_rooms', roomId, 'participants', pid);
          batch.update(pRef, { status: 'in_progress', startedAt: serverTimestamp() });
        });
      }

      await batch.commit();
      alert('Đã phát đề thành công!');
      setSelectedIds(new Set());
      setIsSelectAll(false);

    } catch (err: any) {
      console.error('Lỗi khi bắt đầu thi:', err)
      alert('Có lỗi xảy ra.')
    }
  }

  // 4. Kết thúc bài thi
  const handleFinishExam = async () => {
    if (!confirm('Bạn có chắc chắn muốn KẾT THÚC bài thi? Tất cả học viên sẽ dừng làm bài.')) return
    try {
      await updateDoc(doc(db, 'exam_rooms', roomId), {
        status: 'finished'
      })
    } catch (err: any) {
      console.error('Lỗi khi kết thúc thi:', err)
    }
  }

  // 5. RESET HỌC VIÊN
  const handleResetParticipant = async () => {
    if (selectedIds.size === 0) {
      alert('Vui lòng chọn học viên để Reset.');
      return;
    }
    if (!confirm(`Bạn có chắc muốn RESET bài thi của ${selectedIds.size} học viên đã chọn?`)) return;

    try {
      const batch = writeBatch(db);
      selectedIds.forEach(pid => {
        const pRef = doc(db, 'exam_rooms', roomId, 'participants', pid);
        batch.update(pRef, {
          status: 'waiting',
          score: 0,
          totalQuestions: 0,
          violationCount: 0,
          startedAt: null,
          isPaused: false, // Reset pause
          totalPausedDuration: 0
        });
      });
      await batch.commit();
      alert('Đã reset thành công!');
      setSelectedIds(new Set());
      setIsSelectAll(false);
    } catch (err: any) {
      console.error('Lỗi reset:', err);
      alert('Lỗi khi reset.');
    }
  }

  // 6. KICK HỌC VIÊN
  const handleKickParticipant = async () => {
    if (selectedIds.size === 0) {
      alert('Vui lòng chọn học viên để Mời ra.');
      return;
    }
    if (!confirm(`Bạn có chắc muốn MỜI RA ${selectedIds.size} học viên đã chọn?`)) return;

    try {
      const batch = writeBatch(db);
      selectedIds.forEach(pid => {
        const pRef = doc(db, 'exam_rooms', roomId, 'participants', pid);
        batch.update(pRef, { status: 'kicked' });
      });
      await batch.commit();
      alert('Đã mời ra khỏi phòng!');
      setSelectedIds(new Set());
      setIsSelectAll(false);
    } catch (err: any) {
      console.error('Lỗi kick:', err);
      alert('Lỗi khi kick.');
    }
  }

  // 💖 7. TẠM DỪNG / TIẾP TỤC CÁ NHÂN 💖
  const handleTogglePauseParticipant = async (shouldPause: boolean) => {
    if (selectedIds.size === 0) {
      alert(`Vui lòng chọn học viên để ${shouldPause ? 'Tạm dừng' : 'Tiếp tục'}.`);
      return;
    }

    try {
      const batch = writeBatch(db);
      const now = new Date(); // Lấy thời gian client làm mốc (hoặc serverTimestamp tốt hơn nhưng cần tính toán)

      selectedIds.forEach(pid => {
        const p = participants.find(x => x.id === pid);
        if (!p) return;

        const pRef = doc(db, 'exam_rooms', roomId, 'participants', pid);

        if (shouldPause) {
          // Chỉ pause nếu chưa pause
          if (!p.isPaused) {
            batch.update(pRef, {
              isPaused: true,
              lastPausedAt: serverTimestamp()
            });
          }
        } else {
          // Resume
          if (p.isPaused && p.lastPausedAt) {
            const lastPausedMillis = p.lastPausedAt?.toMillis ? p.lastPausedAt.toMillis() : Date.now();
            const duration = Date.now() - lastPausedMillis;

            batch.update(pRef, {
              isPaused: false,
              totalPausedDuration: (p.totalPausedDuration || 0) + duration,
              lastPausedAt: null // Clear
            });
          }
        }
      });

      await batch.commit();
      alert(`Đã ${shouldPause ? 'Tạm dừng' : 'Tiếp tục'} thi cho các học viên đã chọn!`);
      setSelectedIds(new Set());
      setIsSelectAll(false);

    } catch (err: any) {
      console.error('Lỗi toggle pause:', err);
      alert('Có lỗi xảy ra.');
    }
  }

  // TOGGLE AUTO DISTRIBUTE
  const toggleAutoDistribute = async () => {
    if (!room) return;
    try {
      await updateDoc(doc(db, 'exam_rooms', roomId), {
        auto_distribute: !room.auto_distribute
      });
    } catch (err: any) {
      console.error('Lỗi toggle auto:', err);
    }
  }

  // TOGGLE GLOBAL PAUSE
  const togglePause = async () => {
    if (!room) return;
    try {
      await updateDoc(doc(db, 'exam_rooms', roomId), {
        is_paused: !room.is_paused
      });
    } catch (err: any) {
      console.error('Lỗi toggle pause:', err);
    }
  }

  const handleExportExcel = () => {
    // 1. Tạo header
    const headers = ['STT', 'Họ và Tên', 'Email', 'Trạng thái', 'Điểm số', 'Vi phạm'];

    // 2. Map dữ liệu
    const rows = participants.map((p, index) => [
      index + 1,
      `"${p.fullName}"`, // Quote để tránh lỗi nếu tên có dấu phẩy
      p.email,
      p.status,
      p.score !== undefined ? `'${p.score}/${p.totalQuestions}` : '', // Thêm ' để Excel không tự format ngày tháng
      p.violationCount || 0
    ]);

    // 3. Gộp thành chuỗi CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // 4. Tạo Blob và tải xuống
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // Thêm BOM để Excel đọc đúng tiếng Việt
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `KetQua_${room?.room_name || 'PhongThi'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) return <div className={styles.container}>Đang tải...</div>

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/quan-ly" className={styles.backLink}>&larr; Quay lại</Link>
        <h1 className={styles.title}>Quản lý Phòng thi: {room?.room_name}</h1>
        <div className={styles.statusBadge}>
          {room?.status === 'waiting' ? 'Đang chờ' : room?.status === 'in_progress' ? 'Đang diễn ra' : 'Đã kết thúc'}
        </div>
      </div>

      <div className={styles.controlPanel}>
        <div className={styles.controlGroup}>
          <h3>Điều khiển & Bảo mật</h3>
          <div className={styles.controlRow}>
            <div className={styles.infoText}>
              <strong>Mật khẩu:</strong> {room?.password || '(Không có)'}
            </div>
            <div className={styles.toggleGroup}>
              <label className={styles.toggleLabel}>
                <input type="checkbox" checked={room?.is_paused || false} onChange={togglePause} />
                Tạm dừng thi (Tất cả)
              </label>
              <label className={styles.toggleLabel}>
                <input type="checkbox" checked={room?.auto_distribute || false} onChange={toggleAutoDistribute} />
                Tự động phát đề
              </label>
            </div>
          </div>
        </div>

        <div className={styles.actionButtons}>
          {room?.status === 'waiting' ? (
            <button onClick={handleStartExam} className={styles.startBtn}>
              BẮT ĐẦU BÀI THI (Phát đề tất cả)
            </button>
          ) : (
            <>
              <button onClick={handleStartExam} className={styles.distributeBtn} disabled={selectedIds.size === 0}>
                Phát đề
              </button>
              <button onClick={handleFinishExam} className={styles.finishBtn}>
                KẾT THÚC BÀI THI
              </button>
            </>
          )}
          <button onClick={handleExportExcel} className={styles.excelBtn}>Xuất Excel</button>
        </div>
      </div>

      {/* 💖 PERMANENT ACTION BAR (LUÔN HIỆN) 💖 */}
      <div className={styles.bulkActionBar} style={{ opacity: 1, transform: 'none', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#333' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>Thao tác học viên:</strong>
          {selectedIds.size > 0 ? (
            <span style={{ color: '#0284c7' }}>Đang chọn {selectedIds.size} người</span>
          ) : (
            <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>(Chưa chọn ai)</span>
          )}
        </div>

        <div className={styles.bulkButtons}>
          <button
            onClick={() => handleTogglePauseParticipant(true)}
            className={styles.pauseBtn}
            disabled={selectedIds.size === 0}
            style={{ backgroundColor: selectedIds.size === 0 ? '#cbd5e1' : '#f59e0b', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer' }}
          >
            Tạm dừng
          </button>
          <button
            onClick={() => handleTogglePauseParticipant(false)}
            className={styles.resumeBtn}
            disabled={selectedIds.size === 0}
            style={{ backgroundColor: selectedIds.size === 0 ? '#cbd5e1' : '#16a34a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer' }}
          >
            Tiếp tục
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: '#cbd5e1', margin: '0 10px' }}></div>
          <button
            onClick={handleResetParticipant}
            className={styles.resetBtn}
            disabled={selectedIds.size === 0}
            style={{ opacity: selectedIds.size === 0 ? 0.5 : 1, cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer' }}
          >
            Reset Bài Thi
          </button>
          <button
            onClick={handleKickParticipant}
            className={styles.kickBtn}
            disabled={selectedIds.size === 0}
            style={{ opacity: selectedIds.size === 0 ? 0.5 : 1, cursor: selectedIds.size === 0 ? 'not-allowed' : 'pointer' }}
          >
            Mời ra
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input type="checkbox" checked={isSelectAll} onChange={handleSelectAll} />
              </th>
              <th>STT</th>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Trạng thái</th>
              <th>Điểm số</th>
              <th>Vi phạm</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr key={p.id} className={selectedIds.has(p.id) ? styles.selectedRow : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(p.id)}
                    onChange={() => handleSelectOne(p.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{p.fullName}</td>
                <td>{p.email}</td>
                <td>
                  <span className={`${styles.statusTag} ${styles[p.status]}`}>
                    {p.status === 'waiting' ? 'Chờ thi' :
                      p.status === 'in_progress' ? 'Đang làm' :
                        p.status === 'submitted' ? 'Đã nộp' : 'Đã mời ra'}
                  </span>
                  {/* 💖 HIỂN THỊ TRẠNG THÁI PAUSE 💖 */}
                  {p.isPaused && (
                    <span style={{ marginLeft: '5px', fontSize: '0.8rem', backgroundColor: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', border: '1px solid #fcd34d' }}>
                      ⏸️ Tạm dừng
                    </span>
                  )}
                </td>
                <td className={styles.scoreCell}>
                  {p.score !== undefined ? `${p.score}/${p.totalQuestions}` : '--'}
                </td>
                <td style={{ color: p.violationCount ? 'red' : 'inherit', fontWeight: p.violationCount ? 'bold' : 'normal' }}>
                  {p.violationCount || 0}
                </td>
                <td>
                  {p.violationCount && p.violationCount > 0 ? (
                    <span style={{ color: '#dc2626', fontSize: '0.85rem' }}>⚠️ Chuyển tab: {p.violationCount} lần</span>
                  ) : ''}
                </td>
              </tr>
            ))}
            {participants.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.empty}>Chưa có học viên nào tham gia.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}