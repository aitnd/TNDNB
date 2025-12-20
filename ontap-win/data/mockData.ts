import type { License } from '../types';

export const MOCK_LICENSES: License[] = [
  {
    id: 'maytruong-h1',
    name: 'Máy trưởng hạng nhất - M1',
    subjects: [
      {
        id: 'nvmt',
        name: 'Nghiệp vụ máy trưởng',
        questions: [
          {
            "id": "nvmt_1",
            "text": "Người được dự kiểm tra lấy chứng chỉ an toàn làm việc trên phương tiện đi ven biển, phương tiện chở xăng dầu, chở hoá chất, chở khí hoá lỏng phải",
            "answers": [
              { "id": "1", "text": "Có chứng chỉ thủy thủ trở lên." },
              { "id": "2", "text": "Có chứng chỉ thợ máy trở lên." },
              { "id": "3", "text": "Có chứng chỉ lái phương tiện trở lên." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_2",
            "text": "Thuyền viên có GCNKNCM máy trưởng hạng ba được đảm nhiệm chức danh máy trưởng của phương tiện lắp máy trong có tổng công suất máy chính",
            "answers": [
              { "id": "1", "text": "150 sức ngựa." },
              { "id": "2", "text": "Trên 400 sức ngựa." },
              { "id": "3", "text": "Đến 250 sức ngựa." },
              { "id": "4", "text": "Từ trên 150 đến 400 sức ngựa." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_3",
            "text": "Nếu trên phương tiện không bố trí cơ cấu chức danh máy phó thì người sẽ thực hiện nhiệm vụ thay thế là:",
            "answers": [
              { "id": "1", "text": "Máy phó hai." },
              { "id": "2", "text": "Máy trưởng." },
              { "id": "3", "text": "Thợ máy." },
              { "id": "4", "text": "Máy phó hai và thợ máy." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_4",
            "text": "Độ tuổi được dự kiểm tra lấy chứng chỉ thuỷ thủ, chứng chỉ thợ máy là:",
            "answers": [
              { "id": "1", "text": "Đủ 16 tuổi trở lên." },
              { "id": "2", "text": "Đủ 17 tuổi trở lên." },
              { "id": "3", "text": "Đủ 18 tuổi trở lên." },
              { "id": "4", "text": "Đủ 20 tuổi trở lên." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "nvmt_5",
            "text": "Nguyên tắc bảo vệ môi trường (được quy định trong Luật bảo vệ môi trường, số 72/2020/QH14 ngày 17 tháng 11 năm 2020)",
            "answers": [
              { "id": "1", "text": "5 nguyên tắc." },
              { "id": "2", "text": "6 nguyên tắc." },
              { "id": "3", "text": "7 nguyên tắc." },
              { "id": "4", "text": "8 nguyên tắc." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_6",
            "text": "Khi người lên xuống tàu làm việc không thực hiện những quy định, nội quy của tàu thì người trực ca phải",
            "answers": [
              { "id": "1", "text": "Nhắc nhở nhẹ nhàng." },
              { "id": "2", "text": "Mời lên khỏi tàu." },
              { "id": "3", "text": "Mời lên khỏi tàu sau khi đã có nhắc nhở." },
              { "id": "4", "text": "Báo cáo cho thuyền trưởng biết." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_7",
            "text": "Công dụng của dầu bôi trơn",
            "answers": [
              { "id": "1", "text": "Bôi trơn các bề mặt có chuyển động trượt giữa các chi tiết nhằm giảm ma sát do đó giảm mài mòn, tăng tuổi thọ của chi tiết." },
              { "id": "2", "text": "Rửa sạch bề mặt ma sát của các chi tiết, làm mát một số chi tiết." },
              { "id": "3", "text": "Bao kín khe hở giữa các chi tiết máy, chống ôxy hóa (kết gỉ) bề mặt chi tiết nhờ những chất phụ gia trong dầu." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_8",
            "text": "Bảo vệ môi trường là trách nhiệm của",
            "answers": [
              { "id": "1", "text": "Từng cá nhân trong xã hội." },
              { "id": "2", "text": "Toàn xã hội, quyền và trách nhiệm của cơ quan nhà nước, tổ chức, hộ gia đình, cá nhân." },
              { "id": "3", "text": "Cơ quan nhà nước." },
              { "id": "4", "text": "Cơ quan quản lý môi trường nhà nước." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_9",
            "text": "Thợ máy chịu sự quản lý trực tiếp của",
            "answers": [
              { "id": "1", "text": "Máy trưởng." },
              { "id": "2", "text": "Máy phó một." },
              { "id": "3", "text": "Máy phó hai." },
              { "id": "4", "text": "Máy trưởng và người phụ trách ca máy." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_10",
            "text": "Công dụng của bình bọt chữa cháy",
            "answers": [
              { "id": "1", "text": "Chữa cháy kim loại, chữa cháy điện, hợp kim." },
              { "id": "2", "text": "Dùng để chữa đám cháy nhiên liệu." },
              { "id": "3", "text": "Dùng để chữa đám cháy điện." },
              { "id": "4", "text": "Dùng để chữa đám cháy kim loại." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_11",
            "text": "Trách nhiệm của thuyền viên tập sự trên tàu",
            "answers": [
              { "id": "1", "text": "Chấp hành nghiêm chỉnh các quy định chung đối với thuyền viên." },
              { "id": "2", "text": "Tham gia làm việc, sinh hoạt trên phương tiện theo sự phân công, hướng dẫn của thuyền trưởng hoặc máy trưởng hay người được thuyền trưởng hoặc máy trưởng ủy quyền." },
              { "id": "3", "text": "Chỉ được sử dụng, vận hành máy, trang thiết bị trên phương tiện khi có sự giám sát của người trực tiếp hướng dẫn." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_12",
            "text": "Vị trí kim đồng hồ áp suất trên bình bọt chữa cháy phải mang bình đi nạp lại khi",
            "answers": [
              { "id": "1", "text": "Vạch màu xanh." },
              { "id": "2", "text": "Vạch màu vàng." },
              { "id": "3", "text": "Vạch màu đỏ." },
              { "id": "4", "text": "Tất cả các đáp án trên đều sai." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_13",
            "text": "Công dụng của bình chữa cháy CO2",
            "answers": [
              { "id": "1", "text": "Dùng để chữa đám cháy điện." },
              { "id": "2", "text": "Dùng để chữa đám cháy nhiên liệu, đám cháy kim loại." },
              { "id": "3", "text": "Tất cả các đáp án trên đều đúng." },
              { "id": "4", "text": "Dùng để chữa đám cháy kim loại." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "nvmt_14",
            "text": "Thuyền viên có GCNKNCM thuyền trưởng hạng ba được đảm nhiệm chức danh thuyền trưởng của loại phà có",
            "answers": [
              { "id": "1", "text": "Sức chở đến 50 khách và đến 100 tấn hàng hóa." },
              { "id": "2", "text": "Sức chở đến 50 khách và đến 350 tấn hàng hóa." },
              { "id": "3", "text": "Sức chở đến 50 khách và đến 250 tấn hàng hóa." },
              { "id": "4", "text": "Sức chở đến 100 (một trăm) khách và đến 250 tấn hàng hóa." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_15",
            "text": "Thuyền viên có GCNKNCM máy trưởng hạng nhì được đảm nhiệm chức danh máy trưởng của phương tiện lắp máy trong có tổng công suất máy chính",
            "answers": [
              { "id": "1", "text": "Từ trên 15 đến 150 sức ngựa." },
              { "id": "2", "text": "150 sức ngựa." },
              { "id": "3", "text": "Đến 1000 sức ngựa." },
              { "id": "4", "text": "Trên 400 sức ngựa." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_16",
            "text": "Máy trưởng là người giúp việc thuyền trưởng, trực tiếp phụ trách bộ phận máy và có trách nhiệm và quyền hạn sau đây",
            "answers": [
              { "id": "1", "text": "Quản lý, nắm vững tình trạng kỹ thuật hệ thống động lực; tổ chức phân công, giám sát thuyền viên bộ phận máy trong quá trình vận hành." },
              { "id": "2", "text": "Thực hiện đầy đủ quy định về vận hành máy móc, thiết bị; tổ chức bảo dưỡng thường xuyên, sửa chữa những hạng mục công việc được phép làm của máy móc, thiết bị để bảo đảm hệ thống máy hoạt động có hiệu quả." },
              { "id": "3", "text": "Trực tiếp phụ trách một ca máy. Ngoài giờ đi ca, khi cần thiết phải có mặt ở buồng máy để kịp thời giải quyết công việc theo yêu cầu của thuyền trưởng hoặc đề nghị của máy phó." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_17",
            "text": "Đơn vị của độ nhớt là:",
            "answers": [
              { "id": "1", "text": "°K" },
              { "id": "2", "text": "%" },
              { "id": "3", "text": "Cst" },
              { "id": "4", "text": "°C" }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_18",
            "text": "Trước khi dùng thảm để chữa cháy ta cần phải chú ý yêu cầu",
            "answers": [
              { "id": "1", "text": "Phải được sơn phủ một lớp sơn." },
              { "id": "2", "text": "Phải được nhúng vào nước." },
              { "id": "3", "text": "Không cần phải sơn hay nhúng nước." },
              { "id": "4", "text": "Phải được phủ một lớp bạt." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_19",
            "text": "Tại sao máy trưởng phải lập kế hoạch trước khi nhận dầu:",
            "answers": [
              { "id": "1", "text": "Để hạn chế những sai sót gây hậu quả đâm va." },
              { "id": "2", "text": "Để hạn chế những sai sót gây hậu quả chìm tàu." },
              { "id": "3", "text": "Để hạn chế mất điều khiển tàu." },
              { "id": "4", "text": "Để hạn chế những sai sót gây hậu quả tràn dầu gây cháy, nổ hay ô nhiễm môi trường trong quá trình nhận dầu." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_20",
            "text": "Số thuyền viên được phép lên bờ khi tàu cập cảng",
            "answers": [
              { "id": "1", "text": "Không quá 1/2 tổng số thuyền viên của mỗi bộ phận." },
              { "id": "2", "text": "Không quá 2/3 tổng số thuyền viên của mỗi bộ phận." },
              { "id": "3", "text": "Không quá 1/3 tổng số thuyền viên của mỗi bộ phận." },
              { "id": "4", "text": "Tùy thuyền phó quyết định." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "nvmt_21",
            "text": "Thuyền viên có GCNKNCM thuyền trưởng hạng nhì được đảm nhiệm chức danh thuyền trưởng của loại phà có",
            "answers": [
              { "id": "1", "text": "Sức chở đến 150 khách và đến 350 tấn hàng hóa." },
              { "id": "2", "text": "Sức chở đến 50 khách và đến 350 tấn hàng hóa." },
              { "id": "3", "text": "Sức chở đến 100 khách và đến 250 tấn hàng hóa." },
              { "id": "4", "text": "Sức chở đến 100 (một trăm) khách và đến 350 tấn hàng hóa." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_22",
            "text": "Bảo đảm sự hoạt động bình thường của các máy phụ (nếu có), hệ thống trục chân vịt và máy lái là trách nhiệm và quyền hạn của",
            "answers": [
              { "id": "1", "text": "Máy phó." },
              { "id": "2", "text": "Thuyền phó." },
              { "id": "3", "text": "Thợ máy." },
              { "id": "4", "text": "Máy trưởng." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "nvmt_23",
            "text": "Thuyền viên có GCNKNCM thuyền trưởng hạng nhất được đảm nhiệm chức danh thuyền trưởng của",
            "answers": [
              { "id": "1", "text": "Loại phà có sức chở đến 250 khách và đến 350 tấn hàng hóa." },
              { "id": "2", "text": "Loại phà có sức chở đến 350 khách và đến 350 tấn hàng hóa." },
              { "id": "3", "text": "Loại phà có sức chở đến 300 khách và đến 250 tấn hàng hóa." },
              { "id": "4", "text": "Các loại phương tiện." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_24",
            "text": "Số thuyền viên được phép lên bờ khi tàu neo ở các vùng neo đậu",
            "answers": [
              { "id": "1", "text": "Không quá 1/2 tổng số thuyền viên của mỗi bộ phận." },
              { "id": "2", "text": "Không quá 1/3 tổng số thuyền viên của mỗi bộ phận." },
              { "id": "3", "text": "Tùy thuộc vào máy trưởng." },
              { "id": "4", "text": "Tùy thuộc vào thuyền phó." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_25",
            "text": "Thuyền viên có GCNKNCM máy trưởng hạng nhất được đảm nhiệm chức danh máy trưởng của",
            "answers": [
              { "id": "1", "text": "Phương tiện có tổng công suất máy chính từ trên 15 đến 150 sức ngựa." },
              { "id": "2", "text": "Các loại phương tiện." },
              { "id": "3", "text": "Phương tiện có tổng công suất máy chính trên 400 sức ngựa." },
              { "id": "4", "text": "Phương tiện có tổng công suất máy chính từ trên 15 đến 400 sức ngựa." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_26",
            "text": "Máy phó là người giúp việc cho máy trưởng, có trách nhiệm và quyền hạn",
            "answers": [
              { "id": "1", "text": "Lập kế hoạch công tác của bộ phận máy để máy trưởng duyệt, trực tiếp bố trí công việc, phân công trực ca đối với thuyền viên thuộc bộ phận máy." },
              { "id": "2", "text": "Bảo đảm cho các máy bơm nước của hệ thống cứu hoả, cứu đắm." },
              { "id": "3", "text": "Quản lý các hồ sơ, tài liệu kỹ thuật thuộc bộ phận máy." },
              { "id": "4", "text": "Phụ trách hệ thống máy nén khí, hệ thống ống nước, ống dầu, ống hơi." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "nvmt_27",
            "text": "Máy trưởng phân công công việc cho thuyền viên bộ phận mình quản lý căn cứ vào",
            "answers": [
              { "id": "1", "text": "Khả năng, tay nghề thực tế của mỗi thuyền viên." },
              { "id": "2", "text": "Thực tế công việc dưới tàu." },
              { "id": "3", "text": "Khả năng chuyên môn thông qua giấy chứng nhận trình độ chuyên môn và tay nghề thực tế của thuyền viên." },
              { "id": "4", "text": "Sự phân công trực tiếp của thuyền trưởng." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_28",
            "text": "Người trực ca có trách nhiệm dừng ngay động cơ (sau khi được sự đồng ý của người điều khiển phương tiện) trong trường hợp",
            "answers": [
              { "id": "1", "text": "Áp lực dầu bôi trơn giảm xuống dưới mức quy định và không có khả năng khắc phục ngay trong khi động cơ đang hoạt động." },
              { "id": "2", "text": "Áp lực nhớt giảm xuống." },
              { "id": "3", "text": "Có sự chênh lệch giữa áp lực nhớt trước và sau bầu lọc." },
              { "id": "4", "text": "Có sự hao nhớt trong các te." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "nvmt_29",
            "text": "Thuyền viên tập sự chịu sự quản lý của",
            "answers": [
              { "id": "1", "text": "Thuyền phó." },
              { "id": "2", "text": "Máy trưởng." },
              { "id": "3", "text": "Thuyền trưởng." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "nvmt_30",
            "text": "Công dụng của bình bột chữa cháy cho đám cháy (loại bình ký hiệu ABC):",
            "answers": [
              { "id": "1", "text": "Chữa các đám cháy chất rắn." },
              { "id": "2", "text": "Chữa các đám cháy chất khí." },
              { "id": "3", "text": "Chữa các đám cháy chất lỏng." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_31",
            "text": "Những chỉ số quan trọng khi lựa chọn dầu bôi trơn cho động cơ",
            "answers": [
              { "id": "1", "text": "Tỉ trọng và điểm chớp cháy." },
              { "id": "2", "text": "Chỉ số cấp độ nhớt (SAE) và cấp hiệu năng (API)" },
              { "id": "3", "text": "Độ đông đặc và tỉ trọng." },
              { "id": "4", "text": "Nhiệt độ đóng băng và tỉ trọng." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_32",
            "text": "Thuyền viên có GCNKNCM thuyền trưởng hạng ba được đảm nhiệm chức danh thuyền trưởng của loại phương tiện tàu khách có sức chở",
            "answers": [
              { "id": "1", "text": "Từ trên 5 người đến 12 người." },
              { "id": "2", "text": "Đến 50 người." },
              { "id": "3", "text": "Từ trên 12 người đến 100 người." },
              { "id": "4", "text": "Từ trên 50 người đến 100 người." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_33",
            "text": "Thuyền viên có GCNKNCM thuyền trưởng hạng nhì được đảm nhiệm chức danh thuyền trưởng của loại phương tiện chở hàng có trọng tải toàn phần",
            "answers": [
              { "id": "1", "text": "Từ trên 150 tấn đến 400 tấn." },
              { "id": "2", "text": "Từ trên 150 tấn đến 500 tấn." },
              { "id": "3", "text": "Từ trên 150 tấn đến 600 tấn." },
              { "id": "4", "text": "Đến 1000 tấn." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "nvmt_34",
            "text": "Thuyền viên có GCNKNCM thuyền trưởng hạng nhất được đảm nhiệm chức danh thuyền trưởng của",
            "answers": [
              { "id": "1", "text": "Loại phương tiện đoàn lai có trọng tải toàn phần từ trên 400 tấn đến 1500 tấn." },
              { "id": "2", "text": "Các loại phương tiện." },
              { "id": "3", "text": "Loại phương tiện đoàn lai có trọng tải toàn phần đến 1500 tấn." },
              { "id": "4", "text": "Loại phương tiện đoàn lai có trọng tải toàn phần đến 2000 tấn." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "nvmt_35",
            "text": "Để đảm bảo cho sự vận hành kỹ thuật bình thường và công việc sửa chữa thiết bị động cơ trên tàu thủy phải có các hồ sơ tài liệu kỹ thuật",
            "answers": [
              { "id": "1", "text": "Hồ sơ động cơ chính, động cơ phụ và cơ cấu điều khiển chung." },
              { "id": "2", "text": "Nhật ký điều động tàu." },
              { "id": "3", "text": "Sách hướng dẫn sử dụng VHF." },
              { "id": "4", "text": "Sơ đồ tuyến luồng sông kênh Việt Nam." }
            ],
            "correctAnswerId": "1"
          }
        ]
      },
      {
        id: 'ktvt',
        name: 'Kinh tế vận tải',
        questions: [
          {
            "id": "ktvt_36",
            "text": "Yếu tố ảnh hưởng đến chuyến đi là:",
            "answers": [
              { "id": "1", "text": "Hàng hóa." },
              { "id": "2", "text": "Bến cảng" },
              { "id": "3", "text": "Khí hậu, luồng lạch." },
              { "id": "4", "text": "Tất cả đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "ktvt_37",
            "text": "Thời gian tàu chạy là:",
            "answers": [
              { "id": "1", "text": "Thời gian cần thiết để tàu chạy hết quãng đường vận tải không kể phần thời gian tàu đỗ." },
              { "id": "2", "text": "Thời gian tàu chạy từ cảng xuất đến cảng nhập kể cả thời gian tàu đỗ nghỉ trên đường." },
              { "id": "3", "text": "Khoảng thời gian tính từ khi tàu chạy đến khi dỡ hàng xong." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "ktvt_38",
            "text": "Tốc độ thực tế của tàu là",
            "answers": [
              { "id": "1", "text": "Tốc độ của tàu so với bờ, đã tính đến các ảnh hưởng của sóng, gió và chiều của dòng nước." },
              { "id": "2", "text": "Tốc độ bình quân trong cả chuyến đi." },
              { "id": "3", "text": "Tốc độ vận hành của con tàu đối với nước." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "ktvt_39",
            "text": "Sức tải khởi hành của tàu P' > 1 khi tàu",
            "answers": [
              { "id": "1", "text": "Chở quá tải." },
              { "id": "2", "text": "Chở đủ tải." },
              { "id": "3", "text": "Chở không đủ tải." },
              { "id": "4", "text": "Chạy không hàng." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "ktvt_40",
            "text": "Thời gian tàu đỗ là:.",
            "answers": [
              { "id": "1", "text": "Tổng thời gian tàu neo nghỉ dọc đường, lấy dầu" },
              { "id": "2", "text": "Tổng thời gian tàu cập cầu nhận hàng, trả hàng." },
              { "id": "3", "text": "Tổng các thời gian tàu đỗ cần thiết trong một chuyến đi hay một quay vòng để làm các thao tác kỹ thuật ở các bến và dọc đường." },
              { "id": "4", "text": "Tổng thời gian tàu chờ làm các thủ tục xuất nhập bến, cảng." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "ktvt_41",
            "text": "Lý do làm cho sức tải khởi hành P' < 1",
            "answers": [
              { "id": "1", "text": "Hàng không đủ chở, hàng cồng kềnh nên xếp không hết trọng tải." },
              { "id": "2", "text": "Đi vào khu vực luồng có mớn nước nông." },
              { "id": "3", "text": "Đi trong mùa lũ phải giảm tải." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "ktvt_42",
            "text": "Trong kinh tế vận tải, “năng suất đầu máy” được hiểu là:",
            "answers": [
              { "id": "1", "text": "Tổng lượng nhiên liệu mà động cơ tiêu thụ trong một hành trình" },
              { "id": "2", "text": "Sức kéo tối đa của đầu máy khi tàu đầy tải" },
              { "id": "3", "text": "Lượng công suất hữu ích mà đầu máy tạo ra trong một đơn vị thời gian" },
              { "id": "4", "text": "Thời gian đầu máy làm việc liên tục mà không cần bảo dưỡng" }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "ktvt_42_alt",
            "text": "Năng suất đầu máy là:",
            "answers": [
              { "id": "1", "text": "Số km đi được của tàu mà đầu máy kéo tàu" },
              { "id": "2", "text": "Số lượng sản phẩm vận tải thủy nội địa được tính bằng Tkm do 1 cv làm ra trong một đơn vị thời gian" },
              { "id": "3", "text": "Số lượng nhiên liệu đầu máy tiêu thụ trong chuyến đi" },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng" }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "ktvt_43",
            "text": "Sức tải khởi hành của tàu khách Pk’> 1 khi số khách thực tế xuống tàu",
            "answers": [
              { "id": "1", "text": "Lớn hơn số chỗ ngồi của tàu khách do cơ quan đăng kiểm cho phép." },
              { "id": "2", "text": "Nhỏ hơn số chỗ ngồi của tàu khách do cơ quan đăng kiểm cho phép." },
              { "id": "3", "text": "Bằng số chỗ ngồi của tàu khách do cơ quan đăng kiểm cho phép." },
              { "id": "4", "text": "Lớn hơn số chỗ ngồi của tàu khách." }
            ],
            "correctAnswerId": "1"
          },
          {
            "id": "ktvt_44",
            "text": "Năng suất của tàu là:",
            "answers": [
              { "id": "1", "text": "Số tấn hàng hay hành khách tàu nhận theo hợp đồng." },
              { "id": "2", "text": "Số tấn mà tàu có thể chở được." },
              { "id": "3", "text": "Số lượng sản phẩm vận chuyển được tính bằng Tkm do 1 phương tiện làm ra trong một đơn vị thời gian." },
              { "id": "4", "text": "Số tấn hàng mà tàu nhận được tại cảng." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "ktvt_45",
            "text": "Chi phí nhiên liệu phụ thuộc vào những yếu tố",
            "answers": [
              { "id": "1", "text": "Thời gian hoạt động của đầu máy (t)." },
              { "id": "2", "text": "Tình trạng kỹ thuật của máy (suất tiêu hao nhiên liệu e)." },
              { "id": "3", "text": "Công suất máy (Nak), giá nhiên liệu (a)" },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng" }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "ktvt_46",
            "text": "Phương thức giao nhận hàng hóa trong vận tải thủy là giao, nhận theo",
            "answers": [
              { "id": "1", "text": "Số lượng bao, kiện, container." },
              { "id": "2", "text": "Nguyên hầm, cặp chì." },
              { "id": "3", "text": "Trọng lượng (cân toàn bộ hoặc cân giám định theo tỷ lệ), theo khối lượng (đo mét khối hoặc đong, đếm bằng lít)." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "ktvt_47",
            "text": "Biện pháp để hạ giá thành sản phẩm trong vận tải thủy",
            "answers": [
              { "id": "1", "text": "Giảm các chi phí không cần thiết như: chi phí vật liệu mau hỏng, chi phí sửa chữa đột xuất, chi phí bồi thường va chạm..." },
              { "id": "2", "text": "Tăng lượng hàng hóa luân chuyển." },
              { "id": "3", "text": "Cải tạo luồng lạch." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "4"
          },
          {
            "id": "ktvt_48",
            "text": "Giá thành vận chuyển đường thủy nội địa là",
            "answers": [
              { "id": "1", "text": "Tổng các khoản chi phí cần thiết và hợp lý để làm ra một số lượng sản phẩm là 1Tpt." },
              { "id": "2", "text": "Tổng các khoản chi phí cần thiết và hợp lý để làm ra một số lượng sản phẩm là 1Tkm." },
              { "id": "3", "text": "Tổng lợi nhuận để làm ra một số lượng sản phẩm là 1 tấn hàng." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "2"
          },
          {
            "id": "ktvt_49",
            "text": "Khi giao nhận hàng hóa theo số lượng bao, kiện, container nếu bao, kiện còn nguyên vẹn hoặc container còn nguyên kẹp chì thì người kinh doanh vận tải",
            "answers": [
              { "id": "1", "text": "Phải chịu trách nhiệm về hàng hóa." },
              { "id": "2", "text": "Tùy từng trường hợp mà phải chịu trách nhiệm về hàng hóa." },
              { "id": "3", "text": "Không phải chịu trách nhiệm về hàng hóa ở bên trong." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "3"
          },
          {
            "id": "ktvt_50",
            "text": "Hao phí nhiên liệu phụ thuộc vào những yếu tố",
            "answers": [
              { "id": "1", "text": "Thời gian hoạt động của đầu máy (t), tình trạng kỹ thuật của máy (suất tiêu hao nhiên liệu (e), công suất máy (Nak) và giá nhiên liệu (a)." },
              { "id": "2", "text": "Công suất máy (Nak), giá nhiên liệu (a)." },
              { "id": "3", "text": "Thời gian hoạt động của đầu máy, tình trạng kỹ thuật của máy (suất tiêu hao nhiên liệu và công suất máy)." },
              { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
            ],
            "correctAnswerId": "3"
          }
        ]
      },
      {
        id: 'mtt',
        name: 'Máy tàu thủy',
        questions: [
            {
              "id": "mtt_51",
              "text": "Động cơ 4 kỳ hoàn thành một chu trình công tác trong",
              "answers": [
                { "id": "1", "text": "4 hành trình piston tương ứng với 2 vòng quay trục khuỷu." },
                { "id": "2", "text": "2 hành trình của piston tương ứng với 1 vòng quay trục khuỷu." },
                { "id": "3", "text": "4 hành trình của piston tương ứng với 3 vòng quay trục khuỷu." },
                { "id": "4", "text": "4 hành trình của piston tương ứng với 1 vòng quay trục khuỷu." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_52",
              "text": "Cấu tạo piston được chia làm",
              "answers": [
                { "id": "1", "text": "1 phần." },
                { "id": "2", "text": "2 phần." },
                { "id": "3", "text": "3 phần." },
                { "id": "4", "text": "4 phần." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_53",
              "text": "Nhiệm vụ của xéc măng hơi",
              "answers": [
                { "id": "1", "text": "Làm kín hơi, không cho khí nén và khí cháy rò xuống cácte." },
                { "id": "2", "text": "Làm kín hơi, kín nước." },
                { "id": "3", "text": "Không cho khí nén xuống phía dưới cácte." },
                { "id": "4", "text": "Không cho dầu bôi trơn lọt xuống phía dưới cácte." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_54",
              "text": "Nhiệm vụ của hệ thống cung cấp nhiên liệu",
              "answers": [
                { "id": "1", "text": "Cung cấp một lượng nhiên liệu cho mỗi chu trình công tác của động cơ." },
                { "id": "2", "text": "Lọc sạch nước và các tạp chất có lẫn trong nhiên liệu." },
                { "id": "3", "text": "Chứa một lượng nhiên liệu đảm bảo cho động cơ hoạt động trong suốt hành trình của tàu." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_55",
              "text": "Nhiệm vụ của hệ thống bôi trơn",
              "answers": [
                { "id": "1", "text": "Giảm ma sát, nâng cao tính chống mòn cho các bề mặt ma sát." },
                { "id": "2", "text": "Tẩy rửa và làm mát cho các bề mặt ma sát." },
                { "id": "3", "text": "Góp phần bao kín buồng cháy và giữ cho bề mặt các chi tiết không bị rỉ sét." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_56",
              "text": "Động cơ 2 kỳ hoàn thành một chu trình công tác trong",
              "answers": [
                { "id": "1", "text": "4 hành trình của piston tương ứng với 2 vòng quay trục khuỷu." },
                { "id": "2", "text": "3 hành trình piston tương ứng với 2 vòng quay trục khuỷu." },
                { "id": "3", "text": "2 hành trình của piston tương ứng với 1 vòng quay trục khuỷu." },
                { "id": "4", "text": "4 hành trình piston tương ứng với 1 vòng quay trục khuỷu." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_57",
              "text": "Hệ thống cung cấp nhiên liệu gồm có",
              "answers": [
                { "id": "1", "text": "Két trực nhật, lọc thô, bơm tay, bơm chuyển nhiên liệu, van chặn, lọc tinh, bơm cao áp, vòi phun, đường dầu hồi." },
                { "id": "2", "text": "Két trực nhật, lọc thô, bơm tay, bơm chuyển nhiên liệu." },
                { "id": "3", "text": "Két trực nhật, lọc thô, bơm tay, bơm chuyển nhiên liệu, van chặn, lọc tinh." },
                { "id": "4", "text": "Bơm tay, bơm chuyển nhiên liệu, van chặn, lọc tinh, bơm cao áp, vòi phun." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_58",
              "text": "Thời điểm xupap nạp và xupap xả của một xilanh trong động cơ Diesel 4 kỳ cùng mở",
              "answers": [
                { "id": "1", "text": "Cuối kỳ nạp - đầu kỳ nén." },
                { "id": "2", "text": "Cuối kỳ xả - đầu kỳ nạp." },
                { "id": "3", "text": "Cuối kỳ nén - đầu kỳ nổ." },
                { "id": "4", "text": "Cuối kỳ nổ - đầu kỳ xả." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_59",
              "text": "Để nạp đầy khí mới và thải sạch khí cháy ra ngoài thì xupap nạp và thải phải được",
              "answers": [
                { "id": "1", "text": "Mở sớm và đóng sớm." },
                { "id": "2", "text": "Mở sớm và đóng muộn." },
                { "id": "3", "text": "Mở muộn và đóng muộn." },
                { "id": "4", "text": "Mở muộn và đóng sớm." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_60",
              "text": "Trước khi khởi động động cơ đối với hệ thống bôi trơn phải kiểm tra",
              "answers": [
                { "id": "1", "text": "Nhiệt độ." },
                { "id": "2", "text": "Bơm dầu." },
                { "id": "3", "text": "Mức dầu và chất lượng dầu bôi trơn." },
                { "id": "4", "text": "Áp lực." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_61",
              "text": "Trước khi dừng động cơ",
              "answers": [
                { "id": "1", "text": "Đóng van nước, van dầu." },
                { "id": "2", "text": "Cho động cơ chạy không tải 10 ÷ 15 phút ở vòng quay ổn định nhỏ nhất." },
                { "id": "3", "text": "Đóng van nước, van dầu, ngắt cầu dao." },
                { "id": "4", "text": "Bổ sung nhiên liệu và dầu bôi trơn." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_62",
              "text": "Sau khi dừng động cơ",
              "answers": [
                { "id": "1", "text": "Đóng van thông sông, van dầu đốt, vệ sinh công nghiệp." },
                { "id": "2", "text": "Đưa cần đảo chiều về vị trí “stop”." },
                { "id": "3", "text": "Đưa tay ga nhiên liệu về vị trí nhỏ nhất" },
                { "id": "4", "text": "Đóng van thông sông và đưa cần đảo chiều về vị trí “stop”." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_63",
              "text": "Nhiệm vụ của thanh truyền",
              "answers": [
                { "id": "1", "text": "Truyền lực từ piston xuống trục khuỷu ở kỳ cháy giãn nở." },
                { "id": "2", "text": "Truyền lực từ trục khuỷu lên piston ở kỳ nén." },
                { "id": "3", "text": "Biến chuyển động tịnh tiến của piston thành chuyển động quay của trục khuỷu." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_64",
              "text": "Nhiệm vụ của bơm cao áp là:",
              "answers": [
                { "id": "1", "text": "Tạo áp suất cao cho nhiên liệu." },
                { "id": "2", "text": "Bơm dầu từ két chứa lên két trực nhật." },
                { "id": "3", "text": "Tạo màng sương nhiên liệu." },
                { "id": "4", "text": "Bơm dầu từ két trực nhật tới bơm chuyển nhiên liệu." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_65",
              "text": "Lượng dầu Diesel phun vào buồng đốt động cơ được điều chỉnh nhờ vào",
              "answers": [
                { "id": "1", "text": "Vòi phun." },
                { "id": "2", "text": "Bơm chuyển nhiên liệu." },
                { "id": "3", "text": "Bơm cao áp." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_66",
              "text": "Nhiên liệu được đưa vào buồng đốt của động cơ Diesel ở thời điểm",
              "answers": [
                { "id": "1", "text": "Kỳ hút." },
                { "id": "2", "text": "Cuối kỳ nén." },
                { "id": "3", "text": "Cuối kỳ hút." },
                { "id": "4", "text": "Kỳ nén." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_67",
              "text": "Khi động cơ đang hoạt động phải chú ý đến những thông số kỹ thuật",
              "answers": [
                { "id": "1", "text": "Áp lực dầu bôi trơn và số lượng dầu bôi trơn." },
                { "id": "2", "text": "Nhiệt độ nước làm mát, áp lực dầu bôi trơn và mức dầu trong két dầu trực nhật." },
                { "id": "3", "text": "Số lượng dầu bôi trơn và chất lượng dầu bôi trơn." },
                { "id": "4", "text": "Số lượng dầu bôi trơn và két dầu trực nhật." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_68",
              "text": "Một đơn vị trục khuỷu gồm",
              "answers": [
                { "id": "1", "text": "Cổ trục, cổ khuỷu, má khuỷu và đối trọng." },
                { "id": "2", "text": "Đầu trục, đuôi trục và thân trục." },
                { "id": "3", "text": "Cổ trục, cổ khuỷu." },
                { "id": "4", "text": "Má khuỷu, đối trọng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_69",
              "text": "Trong hệ thống cung cấp nhiên liệu, nhiên liệu đi theo thứ tự từ",
              "answers": [
                { "id": "1", "text": "Két trực nhật, tới bơm cao áp, tới bơm chuyển nhiên liệu, tới vòi phun." },
                { "id": "2", "text": "Bơm chuyển nhiên liệu, tới két trực nhật, tới bơm cao áp, tới vòi phun." },
                { "id": "3", "text": "Két trực nhật, tới bơm chuyển nhiên liệu, tới bơm cao áp, tới vòi phun." },
                { "id": "4", "text": "Bơm chuyển nhiên liệu, tới bơm cao áp, tới két trực nhật, tới vòi phun." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_70",
              "text": "Má khuỷu là phần nối giữa",
              "answers": [
                { "id": "1", "text": "Cổ khuỷu với cổ trục." },
                { "id": "2", "text": "Cổ khuỷu với thanh truyền." },
                { "id": "3", "text": "Cổ trục với bệ đỡ." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_71",
              "text": "Tăng áp cho động cơ Diesel tàu thủy gồm:",
              "answers": [
                { "id": "1", "text": "1 phương pháp." },
                { "id": "2", "text": "3 phương pháp." },
                { "id": "3", "text": "2 phương pháp." },
                { "id": "4", "text": "4 phương pháp." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_72",
              "text": "Đồ thị pha phân phối khí biểu diễn",
              "answers": [
                { "id": "1", "text": "Sự lệch pha của hai xupap làm việc kế tiếp nhau." },
                { "id": "2", "text": "Thời gian mở của xupap nạp." },
                { "id": "3", "text": "Thời gian mở của các xupap." },
                { "id": "4", "text": "Biểu đồ thể hiện góc đóng, mở của các xupap tính bằng độ." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_73",
              "text": "Thông số ảnh hưởng đến chất lượng phun nhiên liệu",
              "answers": [
                { "id": "1", "text": "Số tia nhiên liệu phun ra khỏi vòi phun." },
                { "id": "2", "text": "Áp suất phun nhiên liệu." },
                { "id": "3", "text": "Kích thước lỗ phun." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_74",
              "text": "Để thay đổi lưu lượng cung cấp nhiên liệu ở bơm cao áp Bosch ta điều chỉnh ở",
              "answers": [
                { "id": "1", "text": "Van tiết lưu." },
                { "id": "2", "text": "Van con thoi." },
                { "id": "3", "text": "Bơm cấp nhiên liệu." },
                { "id": "4", "text": "Hành trình có ích của piston bơm cao áp." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_75",
              "text": "Van điều tiết nhiệt độ trong hệ thống làm mát có nhiệm vụ",
              "answers": [
                { "id": "1", "text": "Mở các cửa thông với các đường nước" },
                { "id": "2", "text": "Chặn nước, không cho nước vào các đường nước" },
                { "id": "3", "text": "Tự động điều chỉnh lưu lượng nước qua bầu làm mát theo giá trị đặt." },
                { "id": "4", "text": "Đóng các cửa thông với các đường nước." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_76",
              "text": "Động cơ Diesel tàu thủy thường sử dụng phương pháp tăng áp",
              "answers": [
                { "id": "1", "text": "Tăng áp bằng tuabin khí xả." },
                { "id": "2", "text": "Tăng áp cơ giới." },
                { "id": "3", "text": "Tăng áp hỗn hợp." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_77",
              "text": "Mục đích của việc tăng áp khí nạp là:",
              "answers": [
                { "id": "1", "text": "Nâng cao hiệu suất nhiệt cho động cơ." },
                { "id": "2", "text": "Nâng cao công suất động cơ." },
                { "id": "3", "text": "Giảm thiểu độc hại do khí thải." },
                { "id": "4", "text": "Tiết kiệm nhiên liệu." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_78",
              "text": "Áp lực dầu bôi trơn giảm quá mức quy định do",
              "answers": [
                { "id": "1", "text": "Nhiệt độ dầu quá cao." },
                { "id": "2", "text": "Khe hở các chi tiết cần bôi trơn quá lớn." },
                { "id": "3", "text": "Dầu bôi trơn bẩn." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_79",
              "text": "Hệ thống khởi động có nhiệm vụ:",
              "answers": [
                { "id": "1", "text": "Làm quay trục động cơ." },
                { "id": "2", "text": "Làm quay trục khuỷu đến vòng quay khởi động." },
                { "id": "3", "text": "Làm động cơ hoạt động tốt hơn." },
                { "id": "4", "text": "Làm quay nhanh quạt gió." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_80",
              "text": "Các phương pháp khởi động thường sử dụng cho động cơ Diesel tàu thủy",
              "answers": [
                { "id": "1", "text": "Bằng điện." },
                { "id": "2", "text": "Bằng tay và bằng điện." },
                { "id": "3", "text": "Bằng điện và bằng không khí nén." },
                { "id": "4", "text": "Bằng thủy lực và bằng không khí nén." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_81",
              "text": "Nguyên nhân làm cho nhiệt độ nước làm mát động cơ tăng quá mức quy định",
              "answers": [
                { "id": "1", "text": "Động cơ bị quá tải." },
                { "id": "2", "text": "Mất áp lực nước làm mát." },
                { "id": "3", "text": "Sinh hàn nước làm mát bị bẩn." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_82",
              "text": "Động cơ Diesel sử dụng loại nhiên liệu",
              "answers": [
                { "id": "1", "text": "Dầu DO, FO." },
                { "id": "2", "text": "Xăng." },
                { "id": "3", "text": "Khí gas." },
                { "id": "4", "text": "Dầu hoả." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_83",
              "text": "Khí sót là khí cháy",
              "answers": [
                { "id": "1", "text": "Không được thải hết ra khỏi xilanh ở cuối quá trình thải." },
                { "id": "2", "text": "Được đẩy ra ngoài ống xả." },
                { "id": "3", "text": "Được đẩy ra ngoài ống nạp." },
                { "id": "4", "text": "Còn sót lại ở cửa nạp." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_84",
              "text": "Nguyên nhân làm cho động cơ nóng quá mức quy định",
              "answers": [
                { "id": "1", "text": "Bầu lọc nhiên liệu bị tắc." },
                { "id": "2", "text": "Hết nhiên liệu trong két trực nhật." },
                { "id": "3", "text": "Hỏng vòi phun." },
                { "id": "4", "text": "Mất nước làm mát, động cơ bị quá tải." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_85",
              "text": "Thông số ảnh hưởng đến chất lượng bôi trơn động cơ",
              "answers": [
                { "id": "1", "text": "Nhiệt độ dầu bôi trơn." },
                { "id": "2", "text": "Áp suất dầu bôi trơn." },
                { "id": "3", "text": "Chất lượng dầu bôi trơn." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_86",
              "text": "Nhiệm vụ của bộ điều tốc là tự động điều chỉnh",
              "answers": [
                { "id": "1", "text": "Lượng nhiên liệu cung cấp cho động cơ theo phụ tải và duy trì vòng quay động cơ ổn định." },
                { "id": "2", "text": "Góc phun nhiên liệu sớm." },
                { "id": "3", "text": "Số vòng quay cực đại." },
                { "id": "4", "text": "Nhiệt độ khí xả" }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_87",
              "text": "Tác dụng của đối trọng trên trục khuỷu",
              "answers": [
                { "id": "1", "text": "Để lắp chốt piston" },
                { "id": "2", "text": "Để truyền lực" },
                { "id": "3", "text": "Để cân bằng momen quay của động cơ" },
                { "id": "4", "text": "Để thoát dầu" }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_88",
              "text": "Chỉ số đặc trưng của dầu Diesel là:",
              "answers": [
                { "id": "1", "text": "Chỉ số độ nhớt." },
                { "id": "2", "text": "Hàm lượng lưu huỳnh." },
                { "id": "3", "text": "Thời điểm phun nhiên liệu." },
                { "id": "4", "text": "Trị số xêtan." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_89",
              "text": "Nguyên nhân dẫn tới sai lệch góc phun sớm nhiên liệu của động cơ Diesel",
              "answers": [
                { "id": "1", "text": "Cam nhiên liệu mòn, con đội mòn, đặt sai góc phun sớm." },
                { "id": "2", "text": "Van xuất dầu bị hỏng." },
                { "id": "3", "text": "Bơm cấp nhiên liệu hỏng." },
                { "id": "4", "text": "Hết nhiên liệu." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_90",
              "text": "Ở động cơ đốt trong nhiệt độ làm mát máy nóng quá quy định sẽ làm",
              "answers": [
                { "id": "1", "text": "Chi tiết máy chóng mài mòn và động cơ bị bó không hoạt động được." },
                { "id": "2", "text": "Nhiên liệu khó bay hơi." },
                { "id": "3", "text": "Nhiên liệu khó cháy." },
                { "id": "4", "text": "Động cơ hoạt động bình thường." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_91",
              "text": "Chọn câu đúng nhất trong các câu dưới đây",
              "answers": [
                { "id": "1", "text": "Cổ khuỷu dùng để lắp đầu to với thanh truyền" },
                { "id": "2", "text": "Thanh truyền biến chuyển động tịnh tiến piston thành chuyển động quay trục khuỷu" },
                { "id": "3", "text": "Nhiệm vụ của piston làm trục khuỷu quay" },
                { "id": "4", "text": "Chốt piston nối má khuỷu và cổ khuỷu" }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_92",
              "text": "Động cơ Diesel 4 kỳ khi hoạt động có khí thải màu xanh lam do",
              "answers": [
                { "id": "1", "text": "Nhiên liệu phun quá nhiều." },
                { "id": "2", "text": "Động cơ bị quá tải." },
                { "id": "3", "text": "Sai lệch góc phun sớm." },
                { "id": "4", "text": "Dầu bôi trơn lọt vào buồng đốt." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_93",
              "text": "Các loại nhiên liệu nào dưới đây cần phải hâm",
              "answers": [
                { "id": "1", "text": "Dầu Diesel" },
                { "id": "2", "text": "Xăng" },
                { "id": "3", "text": "Dầu FO" },
                { "id": "4", "text": "Cả 3 loại trên" }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_94",
              "text": "Điều kiện làm việc của trục khuỷu",
              "answers": [
                { "id": "1", "text": "Chịu tác dụng của áp lực khí cháy" },
                { "id": "2", "text": "Chịu lực quán tính của các chi tiết động" },
                { "id": "3", "text": "Chịu uốn, chịu xoắn, chịu ma sát, chịu mỏi" },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng" }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_95",
              "text": "Thông số ảnh hưởng đến chất lượng làm mát động cơ",
              "answers": [
                { "id": "1", "text": "Nhiệt độ nước làm mát." },
                { "id": "2", "text": "Lưu lượng nước làm mát." },
                { "id": "3", "text": "Chất lượng nước làm mát." },
                { "id": "4", "text": "Tất cả các đáp án trên." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_96",
              "text": "Động cơ diesel tàu thủy thường sử dụng các bộ điều tốc sau:",
              "answers": [
                { "id": "1", "text": "Bộ điều tốc thủy lực." },
                { "id": "2", "text": "Bộ điều tốc cơ khí." },
                { "id": "3", "text": "Bộ điều tốc điện tử." },
                { "id": "4", "text": "Tất cả các đáp án đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_97",
              "text": "Điều kiện làm việc của piston",
              "answers": [
                { "id": "1", "text": "Chịu mài mòn." },
                { "id": "2", "text": "Chịu ăn mòn." },
                { "id": "3", "text": "Chịu ứng suất nhiệt." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_98",
              "text": "Trong động cơ Diesel 2 kì quét vòng có giai đoạn tổn thất khí quét là do:",
              "answers": [
                { "id": "1", "text": "Hàng cửa thải bố trí cao hơn hàng cửa nạp." },
                { "id": "2", "text": "Hàng cửa thải bố trí thấp hơn hàng cửa nạp." },
                { "id": "3", "text": "Hàng cửa thải bố trí cao bằng hàng cửa nạp." },
                { "id": "4", "text": "Xu páp thải đóng trước hàng cửa nạp." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_99",
              "text": "Trong động cơ Diesel 2 kì quét khí thẳng qua xu páp:",
              "answers": [
                { "id": "1", "text": "Hàng cửa thải bố trí thấp hơn hàng cửa nạp." },
                { "id": "2", "text": "Xu páp thải mở trước và đóng sau cửa nạp." },
                { "id": "3", "text": "Xu páp thải đóng trước xu páp nạp." },
                { "id": "4", "text": "Xu páp thải mở đóng trước cửa nạp." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_100",
              "text": "Trong một chu trình công tác, áp suất trong lòng xy lanh của động cơ Diesel 2 kỳ:",
              "answers": [
                { "id": "1", "text": "Có lúc nhỏ hơn áp suất khí trời." },
                { "id": "2", "text": "Luôn lớn hơn áp suất khí trời." },
                { "id": "3", "text": "Luôn nhỏ hơn áp suất khí trời." },
                { "id": "4", "text": "Có lúc lớn hơn áp suất khí trời." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_101",
              "text": "Nhiên liệu khi phun vào buồng đốt của động cơ Diesel cháy được là nhờ:",
              "answers": [
                { "id": "1", "text": "Bugi đốt cháy." },
                { "id": "2", "text": "Hòa trộn với không khí." },
                { "id": "3", "text": "Gặp không khí (sạch) nén có nhiệt độ và áp suất cao." },
                { "id": "4", "text": "Tất cả đáp án trên." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_102",
              "text": "Máy chính là động cơ Diesel một chiều, để đảo chiều quay trục chân vịt thông qua:",
              "answers": [
                { "id": "1", "text": "Hộp số." },
                { "id": "2", "text": "Hệ thống nhiên liệu." },
                { "id": "3", "text": "Hệ thống tăng áp." },
                { "id": "4", "text": "Hệ thống khởi động." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_103",
              "text": "Động cơ Diesel 2 kỳ:",
              "answers": [
                { "id": "1", "text": "Không có xu páp." },
                { "id": "2", "text": "Không có xu páp nạp." },
                { "id": "3", "text": "Không có xu páp thải." },
                { "id": "4", "text": "Tất cả đáp án trên." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_104",
              "text": "Giai đoạn quét khí trong động cơ 2 kỳ là giai đoạn:",
              "answers": [
                { "id": "1", "text": "Vừa thải khí cũ vừa nạp khí mới." },
                { "id": "2", "text": "Nạp khí mới." },
                { "id": "3", "text": "Thải khí cũ ." },
                { "id": "4", "text": "Dò lọt khí." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_105",
              "text": "Yếu tố nguồn nhiệt của phản ứng cháy ở trong buồng đốt động cơ Diesel là:",
              "answers": [
                { "id": "1", "text": "Nhiệt độ của khí cháy trong xy lanh động cơ ở cuối quá trình cháy." },
                { "id": "2", "text": "Nhiệt độ của không khí trong xi lanh động cơ ở cuối quá trình nén." },
                { "id": "3", "text": "Nhiệt độ cao nhất của khí cháy trong xi lanh động cơ ở quá trình cháy." },
                { "id": "4", "text": "Nhiệt độ trung bình của khí cháy trong xi lanh động cơ." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_106",
              "text": "Nhiệt độ nước làm mát động cơ thấp hơn mức quy định làm:",
              "answers": [
                { "id": "1", "text": "Giảm hiệu suất của động cơ." },
                { "id": "2", "text": "Tăng ứng suất nhiệt của các chi tiết." },
                { "id": "3", "text": "Giảm tuổi thọ động cơ." },
                { "id": "4", "text": "Tất cả đáp án trên." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "mtt_107",
              "text": "Ở hệ thống khởi động động cơ bằng khí nén, góc đưa khí nén vào xy lanh động cơ là:",
              "answers": [
                { "id": "1", "text": "Góc độ quay trục khuỷu ứng với quá trình nén." },
                { "id": "2", "text": "Góc độ quay trục khuỷu tính từ điểm chết trên tới khi xu páp khởi động đóng." },
                { "id": "3", "text": "Góc độ quay trục khuỷu tính từ điểm chết trên tới khi xu páp thải đóng." },
                { "id": "4", "text": "Góc độ quay trục khuỷu ứng với quá trình cháy giãn nở." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "mtt_108",
              "text": "Bộ tự động điều chỉnh tốc độ động cơ điều chỉnh:",
              "answers": [
                { "id": "1", "text": "Lượng nhiên liệu cung cấp cho mỗi chu trình công tác theo tốc độ quay của động cơ." },
                { "id": "2", "text": "Tốc độ quay của động cơ theo lượng nhiên liệu cung cấp cho mỗi chu trình công tác." },
                { "id": "3", "text": "Tốc độ quay nhỏ nhất của động cơ." },
                { "id": "4", "text": "Tốc độ quay lớn nhất của động cơ." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "mtt_109",
              "text": "Ứng suất nhiệt của chi tiết là do:",
              "answers": [
                { "id": "1", "text": "Nhiệt độ cao nhất của chi tiết." },
                { "id": "2", "text": "Nhiệt độ thấp nhất của chi tiết." },
                { "id": "3", "text": "Sự chênh lệch lớn về nhiệt độ của chi tiết." },
                { "id": "4", "text": "Tất cả đáp án trên." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "mtt_110",
              "text": "Kiểm tra mức dầu bôi trơn trong động cơ tàu thủy nên được thực hiện vào thời điểm nào là đúng nhất?",
              "answers": [
                { "id": "1", "text": "Trong khi động cơ đang hoạt động ở tốc độ cao" },
                { "id": "2", "text": "Ngay sau khi động cơ vừa dừng lại" },
                { "id": "3", "text": "Khi động cơ nguội và tàu đang ở tư thế cân bằng" },
                { "id": "4", "text": "Bất kỳ lúc nào cũng được, không cần điều kiện cụ thể" }
              ],
              "correctAnswerId": "3"
            }
        ]
      },
      {
        id: 'dtt',
        name: 'Điện tàu thủy',
        questions: [
            {
              "id": "dtt_111",
              "text": "Khi sử dụng ắc quy cần chú ý tới các thông số kỹ thuật cơ bản",
              "answers": [
                { "id": "1", "text": "Điện áp định mức, dung lượng định mức." },
                { "id": "2", "text": "Điện áp định mức, dòng điện." },
                { "id": "3", "text": "Dung lượng định mức, dòng điện định mức." },
                { "id": "4", "text": "Dung lượng định mức." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_112",
              "text": "Điểm giống nhau của máy phát điện và động cơ điện là:",
              "answers": [
                { "id": "1", "text": "Cùng là máy biến đổi điện năng thành cơ năng." },
                { "id": "2", "text": "Cấu tạo chung đều là máy điện quay." },
                { "id": "3", "text": "Cùng là máy biến đổi cơ năng thành điện năng." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_113",
              "text": "Quy trình đấu dây cho một mạch điện đúng là:",
              "answers": [
                { "id": "1", "text": "Thiết bị đóng ngắt, bảo vệ - thiết bị tiêu thụ điện - nguồn điện." },
                { "id": "2", "text": "Thiết bị tiêu thụ điện - thiết bị đóng ngắt, bảo vệ - nguồn điện." },
                { "id": "3", "text": "Nguồn điện - thiết bị đóng ngắt, bảo vệ - thiết bị tiêu thụ điện." },
                { "id": "4", "text": "Thiết bị tiêu thụ điện - nguồn điện - thiết bị đóng ngắt, bảo vệ." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_114",
              "text": "Máy điện một chiều khi làm việc phát tia lửa điện lớn ở chổi than và cổ góp là do",
              "answers": [
                { "id": "1", "text": "Cổ góp bị mài mòn không đều và bẩn." },
                { "id": "2", "text": "Chổi than mòn, lò xo yếu." },
                { "id": "3", "text": "Dòng tải lớn." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_115",
              "text": "Hiện tượng sunfat hóa các bản cực bình ắc quy axit là:",
              "answers": [
                { "id": "1", "text": "Nạp bình nhanh no điện." },
                { "id": "2", "text": "Nhanh phóng hết điện." },
                { "id": "3", "text": "Dung dịch sôi nhanh." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_116",
              "text": "Máy phát điện là máy điện biến đổi",
              "answers": [
                { "id": "1", "text": "Cơ năng thành điện năng." },
                { "id": "2", "text": "Điện năng thành cơ năng." },
                { "id": "3", "text": "Nhiệt năng thành cơ năng." },
                { "id": "4", "text": "Quang năng thành cơ năng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_117",
              "text": "Hoạt động của máy phát điện xoay chiều ba pha",
              "answers": [
                { "id": "1", "text": "Dựa trên nguyên lý lực điện từ." },
                { "id": "2", "text": "Dựa trên nguyên lý cảm ứng điện từ và lực điện từ." },
                { "id": "3", "text": "Dựa trên hiện tượng cảm ứng điện từ." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_118",
              "text": "Máy biến áp kiểu điện từ là",
              "answers": [
                { "id": "1", "text": "Máy điện dùng biến đổi điện áp xoay chiều nhưng tần số không đổi." },
                { "id": "2", "text": "Máy điện dùng biến đổi điện áp và tần số dòng điện." },
                { "id": "3", "text": "Máy biến đổi tần số nhưng giữ nguyên điện áp." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_119",
              "text": "Lõi thép của máy biến áp gồm nhiều lá thép kỹ thuật điện mỏng, sơn cách điện và ghép chặt lại nhằm",
              "answers": [
                { "id": "1", "text": "Giảm dòng điện phu cô trong lõi thép." },
                { "id": "2", "text": "Đảm bảo độ bền cho các lá thép." },
                { "id": "3", "text": "Chống rò điện từ lõi ra vỏ máy." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_120",
              "text": "Máy biến áp không làm biến đổi đại lượng nào sau đây",
              "answers": [
                { "id": "1", "text": "Điện áp." },
                { "id": "2", "text": "Tần số của dòng điện." },
                { "id": "3", "text": "Cường độ dòng điện." },
                { "id": "4", "text": "Điện áp và cường độ dòng điện." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_121",
              "text": "Có 3 bình ắc quy U1 = 12V, Q1 = 150Ah; U2 = U3 = 12V, Q2 = Q3 = 75Ah. Để có nguồn điện có điện áp U = 24V và Q = 150Ah thì phải đấu",
              "answers": [
                { "id": "1", "text": "Nối tiếp hai bình U2 với U3 sau đó song song với bình U1." },
                { "id": "2", "text": "Nối tiếp các bình với nhau." },
                { "id": "3", "text": "Song song các bình với nhau." },
                { "id": "4", "text": "Song song hai bình U2 với U3 sau đó đấu nối tiếp với bình U1." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_122",
              "text": "Trạng thái có tải của máy biến áp là trạng thái",
              "answers": [
                { "id": "1", "text": "Cuộn sơ cấp nối với nguồn, cuộn thứ cấp nối với tải." },
                { "id": "2", "text": "Cuộn sơ cấp hở mạch, cuộn thứ cấp đặt vào tải." },
                { "id": "3", "text": "Cuộn sơ cấp đặt vào nguồn điện áp U1, cuộn thứ cấp hở mạch." },
                { "id": "4", "text": "Cuộn sơ cấp đặt vào nguồn điện áp U1, cuộn thứ cấp ngắn mạch." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_123",
              "text": "Trong quá trình làm việc, máy biến áp có các loại tổn hao",
              "answers": [
                { "id": "1", "text": "Chỉ có tổn hao điện." },
                { "id": "2", "text": "Chỉ có tổn hao từ." },
                { "id": "3", "text": "Tổn hao từ và tổn hao điện." },
                { "id": "4", "text": "Không bị tổn hao nào." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_124",
              "text": "Động cơ điện xoay chiều một pha hoạt động dựa trên hiện tượng",
              "answers": [
                { "id": "1", "text": "Lực điện từ và cảm ứng điện từ." },
                { "id": "2", "text": "Tán sắc ánh sáng." },
                { "id": "3", "text": "Giao thoa ánh sáng." },
                { "id": "4", "text": "Điện trường." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_125",
              "text": "Máy biến áp có số vòng dây cuộn sơ cấp lớn hơn 10 lần so với cuộn thứ cấp là máy",
              "answers": [
                { "id": "1", "text": "Tăng áp." },
                { "id": "2", "text": "Hạ áp." },
                { "id": "3", "text": "Làm giảm tần số dòng điện ở cuộn sơ cấp 10 lần." },
                { "id": "4", "text": "Làm tăng tần số dòng điện ở cuộn sơ cấp 10 lần." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_126",
              "text": "Mạch điện xoay chiều ba pha",
              "answers": [
                { "id": "1", "text": "Là mạch điện gồm nguồn điện, dây dẫn và tải." },
                { "id": "2", "text": "Là mạch điện gồm nguồn và tải ba pha1." },
                { "id": "3", "text": "Là mạch điện gồm nguồn và dây dẫn ba pha." },
                { "id": "4", "text": "Là mạch điện gồm nguồn điện ba pha, dây dẫn ba pha, tải ba pha và các thiết bị khống chế bảo vệ (nếu có)." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_127",
              "text": "Khi đấu dây động cơ 3 pha cần phải căn cứ vào",
              "answers": [
                { "id": "1", "text": "Điện áp dây của nguồn." },
                { "id": "2", "text": "Điện áp dây của nguồn và hướng dẫn đấu dây của động cơ." },
                { "id": "3", "text": "Điện áp của tải." },
                { "id": "4", "text": "Hướng dẫn đấu dây của động cơ." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_128",
              "text": "Ưu điểm của phương pháp khởi động động cơ 3 pha kiểu từ sao sang tam giác là:",
              "answers": [
                { "id": "1", "text": "Dòng khởi động giảm đi ba lần." },
                { "id": "2", "text": "Điện áp khởi động tăng lên ba lần." },
                { "id": "3", "text": "Mô men khởi động tăng lên ba lần." },
                { "id": "4", "text": "Mô men khởi động giảm đi ba lần." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_129",
              "text": "Để điều chỉnh tốc độ động cơ không đồng bộ ba pha người ta sử dụng các phương pháp:",
              "answers": [
                { "id": "1", "text": "Thay đổi số cặp cực." },
                { "id": "2", "text": "Thay đổi điện áp, tần số nguồn cung cấp." },
                { "id": "3", "text": "Thay đổi điện trở mạch rô to." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_130",
              "text": "Nhược điểm của phương pháp khởi động trực tiếp động cơ không đồng bộ là:",
              "answers": [
                { "id": "1", "text": "Mô men khởi động nhỏ, thiết bị khởi động phức tạp." },
                { "id": "2", "text": "Dòng khởi động lớn và chỉ dùng với động cơ công suất nhỏ." },
                { "id": "3", "text": "Thời gian khởi động lớn do quán tính của động cơ lớn." },
                { "id": "4", "text": "Chỉ áp dụng được với động cơ công suất lớn, còn động cơ công suất nhỏ không áp dụng được." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_131",
              "text": "Đưa điện trở phụ vào trong rotor của động cơ dây quấn không đồng bộ 3 pha để",
              "answers": [
                { "id": "1", "text": "Tăng mô men mở máy." },
                { "id": "2", "text": "Tăng mô men khởi động, điều chỉnh tốc độ động cơ." },
                { "id": "3", "text": "Giảm điện trở của dây quấn stator." },
                { "id": "4", "text": "Giảm điện kháng dây quấn stator." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_132",
              "text": "Động cơ không đồng bộ ba pha là",
              "answers": [
                { "id": "1", "text": "Thiết bị điện biến điện năng xoay chiều thành cơ năng." },
                { "id": "2", "text": "Nguyên tắc hoạt động của động cơ không đồng bộ ba pha dựa trên hiện tượng cảm ứng điện từ." },
                { "id": "3", "text": "Động cơ không đồng bộ ba pha là thiết bị biến cơ năng thành điện năng." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_133",
              "text": "Để đảo chiều quay động cơ điện 3 pha thì phải",
              "answers": [
                { "id": "1", "text": "Thay đổi điện áp nguồn." },
                { "id": "2", "text": "Thay đổi vị trí của các dây pha." },
                { "id": "3", "text": "Thay đổi vị trí hai dây pha đấu vào nguồn." },
                { "id": "4", "text": "Thay đổi cách đấu dây của động cơ." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_134",
              "text": "Đồng hồ VOM dùng để đo các đại lượng điện nào:",
              "answers": [
                { "id": "1", "text": "Đo cường độ dòng điện, điện áp và điện trở của mạch điện." },
                { "id": "2", "text": "Đo công suất, tần số và điện dung của tụ điện." },
                { "id": "3", "text": "Đo vòng quay của động cơ điện." },
                { "id": "4", "text": "Đo được tất cả các thông số cơ bản trên." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_135",
              "text": "Sử dụng đồng hồ VOM đo các thông số kỹ thuật điện cần chú ý:",
              "answers": [
                { "id": "1", "text": "Nguyên lý, cấu tạo của đồng hồ." },
                { "id": "2", "text": "Chọn thang đo phù hợp đúng với nguồn điện cần đo." },
                { "id": "3", "text": "Chọn chế độ cho thông số cần đo." },
                { "id": "4", "text": "Cả ba đáp án trên." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_136",
              "text": "Theo cách đấu phần cảm, động cơ điện một chiều có các loại",
              "answers": [
                { "id": "1", "text": "Động cơ điện một chiều kích từ song song." },
                { "id": "2", "text": "Động cơ điện một chiều kích từ nối tiếp." },
                { "id": "3", "text": "Động cơ điện một chiều kích từ hỗn hợp." },
                { "id": "4", "text": "Tất cả các đáp án trên đều đúng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_137",
              "text": "Khởi động động cơ không đồng bộ 3 pha bằng phương pháp đổi nối Y/A được sử dụng cho động cơ:",
              "answers": [
                { "id": "1", "text": "Chỉ làm việc bình thường ở chế độ A." },
                { "id": "2", "text": "Chỉ làm việc bình thường ở chế độ Y." },
                { "id": "3", "text": "Cả a và b." },
                { "id": "4", "text": "Không có đáp án nào đúng." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_138",
              "text": "Động cơ điện không đồng bộ 3 pha là động cơ điện:",
              "answers": [
                { "id": "1", "text": "Có tốc độ quay của roto bằng với tốc độ quay của từ trường." },
                { "id": "2", "text": "Có tốc độ quay của roto lớn hơn tốc độ quay của từ trường." },
                { "id": "3", "text": "Có tốc độ quay của roto nhỏ hơn tốc độ quay của từ trường." },
                { "id": "4", "text": "Có tốc độ quay của roto lúc lớn hơn, lúc nhỏ hơn tốc độ quay của từ trường." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_139",
              "text": "Bản chất của sự cố ngắn mạch:",
              "answers": [
                { "id": "1", "text": "Dòng điện tăng đột ngột." },
                { "id": "2", "text": "Dòng điện giảm đột ngột." },
                { "id": "3", "text": "Điện áp giảm đột ngột." },
                { "id": "4", "text": "Cả 3 đáp án trên." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_140",
              "text": "Kiểm tra, đo điện trở cách điện cho máy điện trên tàu thủy nhằm mục đích:",
              "answers": [
                { "id": "1", "text": "Tránh bị điện giật." },
                { "id": "2", "text": "Phòng tránh chạm chập các cuộn dây và vỏ máy." },
                { "id": "3", "text": "Tránh hư hỏng động cơ lai máy phát." },
                { "id": "4", "text": "Tránh hư hỏng phần roto của máy." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_141",
              "text": "Máy phát điện một chiều trên tàu thủy do động cơ chính lai sử dụng để:",
              "answers": [
                { "id": "1", "text": "Nạp điện cho bình ắc quy." },
                { "id": "2", "text": "Thắp sáng sinh hoạt và cho các thiết bị báo hiệu, báo động khi không có nguồn xoay chiều." },
                { "id": "3", "text": "Cho các thiết bị điện hàng hải sử dụng nguồn một chiều" },
                { "id": "4", "text": "Cả ba đáp án trên" }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_142",
              "text": "Máy phát điện một chiều do động cơ máy chính lai theo cấu tạo và nguyên lý được phân thành:",
              "answers": [
                { "id": "1", "text": "2 loại." },
                { "id": "2", "text": "3 loại." },
                { "id": "3", "text": "4 loại." },
                { "id": "4", "text": "5 loại." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_143",
              "text": "Quy trình đấu dây một mạch điện cho hệ thống khởi động động cơ bằng nguồn điện một chiều phải theo thứ tự:",
              "answers": [
                { "id": "1", "text": "Đấu mạch điều khiển, mạch động lực, đấu dây điều khiển vào nguồn ắc quy" },
                { "id": "2", "text": "Đấu các dây có cực âm (-) trước, các dây cực dương (+) sau." },
                { "id": "3", "text": "Dây cực dương (+) của mạch điều khiển, Đấu dây cực âm (-) xong đấu dây cực dương (+) của mạch động lực." },
                { "id": "4", "text": "Dây cực dương (+) mạch điều khiển và động lực, đấu dây cực (-) vào máy và ắc quy sau cùng." }
              ],
              "correctAnswerId": "4"
            },
            {
              "id": "dtt_144",
              "text": "Trong quá trình khai thác máy phát điện nóng quá mức bình thường nguyên nhân có thể do:",
              "answers": [
                { "id": "1", "text": "Vòng quay máy phát quá cao." },
                { "id": "2", "text": "Động cơ lai máy phát làm việc không ổn định." },
                { "id": "3", "text": "Phụ tải vượt quá công suất định mức." },
                { "id": "4", "text": "Dòng điện kích từ không ổn định." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_145",
              "text": "Động cơ điện một chiều dùng để khởi động máy Diesel tàu thủy nào sau đây có mô men mở máy lớn nhất:",
              "answers": [
                { "id": "1", "text": "Động cơ có 2 cực từ." },
                { "id": "2", "text": "Động cơ có 4 cực từ." },
                { "id": "3", "text": "Động cơ có 6 cực từ." },
                { "id": "4", "text": "Ba loại trên như nhau." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_146",
              "text": "Nguồn điện xoay chiều 3 pha:",
              "answers": [
                { "id": "1", "text": "Có 3 dây pha và 1 dây trung tính." },
                { "id": "2", "text": "Có 2 dây pha và 1 dây trung tính." },
                { "id": "3", "text": "Có 3 dây pha." },
                { "id": "4", "text": "Có 2 dây pha" }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_147",
              "text": "Để đảo chiều quay động cơ điện 3 pha thì phải:",
              "answers": [
                { "id": "1", "text": "Thay đổi điện áp nguồn." },
                { "id": "2", "text": "Thay đổi vị trí của các dây pha." },
                { "id": "3", "text": "Thay đổi vị trí hai dây pha đấu vào nguồn." },
                { "id": "4", "text": "Thay đổi cách đấu dây của động cơ." }
              ],
              "correctAnswerId": "3"
            },
            {
              "id": "dtt_148",
              "text": "Rơ le nhiệt lắp trong hộp khởi động từ cho các động cơ điện xoay chiều 3 pha không đồng bộ có tác dụng:",
              "answers": [
                { "id": "1", "text": "Chống mất pha." },
                { "id": "2", "text": "Bảo vệ động cơ khi khỏi bị quá tải." },
                { "id": "3", "text": "Tăng mô men mở máy cho động cơ." },
                { "id": "4", "text": "Đóng và tách nhanh động cơ ra khỏi nguồn điện." }
              ],
              "correctAnswerId": "2"
            },
            {
              "id": "dtt_149",
              "text": "Aptomat là khí cụ điện dùng để:",
              "answers": [
                { "id": "1", "text": "Tự động cắt mạch điện, bảo vệ quá tải, ngắn mạch, thấp áp... cho mạch điện." },
                { "id": "2", "text": "Tự động đóng mạch điện." },
                { "id": "3", "text": "Ổn định điện áp cho mạch điện." },
                { "id": "4", "text": "Bảo vệ cầu chì không đứt." }
              ],
              "correctAnswerId": "1"
            },
            {
              "id": "dtt_150",
              "text": "Nguyên lý làm việc của Aptomat bảo vệ quá tải (dòng cực đại) là:",
              "answers": [
                { "id": "1", "text": "Nóng chảy các dây chì." },
                { "id": "2", "text": "Làm biến dạng các thanh lưỡng kim." },
                { "id": "3", "text": "Lực hút điện từ sinh ra của các cuộn dòng." },
                { "id": "4", "text": "Lực đàn hồi của lò xo." }
              ],
              "correctAnswerId": "3"
            }
        ]
      }
    ]
  }
];