-- REWRITTEN WITH EXPLICIT IDS
INSERT INTO licenses (id, name, display_order) VALUES ('giam-khao', 'Giám khảo', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO subjects (id, name, license_id, display_order) VALUES ('gk-lt-chung', 'Lý thuyết chung', 'giam-khao', 1) ON CONFLICT (id) DO NOTHING;

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_1', 'gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi. coi kiểm tra, chấm kiểm tra thì:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_1_a1', 'gk_ltc_1', 'Được Chi Cục Hàng hải và Đường thủy Phía Nam cấp thẻ giám khảo') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_1_a2', 'gk_ltc_1', 'Được Cục Hàng hải và Đường thủy Việt Nam cấp thẻ giám khảo.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_1_a3', 'gk_ltc_1', 'Được công bố trên cồng thông tin điện tử của Cục Hàng hải và Đường thủy Việt Nam.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_1_a4', 'gk_ltc_1', 'Được Sở GTVT địa phương cấp thẻ giám khảo.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_1_a3' WHERE id = 'gk_ltc_1';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_2', 'gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là T.TH1') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_2_a1', 'gk_ltc_2', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng nhất;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_2_a2', 'gk_ltc_2', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng nhất;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_2_a3', 'gk_ltc_2', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng nhì;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_2_a4', 'gk_ltc_2', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng nhì;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_2_a2' WHERE id = 'gk_ltc_2';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_3', 'gk-lt-chung', 'Người có bằng tốt nghiệp cao đẳng trở lên được đào tạo nghề máy tàu biển, có GCNKNCM máy trưởng tàu biển từ 750 kW trở lên, có thời gian đảm nhiệm theo chức danh máy trưởng tàu biển tương ứng đủ 06 tháng trở lên được chuyển đổi sang:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_3_a1', 'gk_ltc_3', 'GCNKNCM máy trưởng hạng ba phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_3_a2', 'gk_ltc_3', 'GCNKNCM máy trưởng hạng nhì phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_3_a3', 'gk_ltc_3', 'Chứng chỉ thợ mày phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_3_a4', 'gk_ltc_3', 'GCNKNCM máy trưởng hạng nhất phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_3_a4' WHERE id = 'gk_ltc_3';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_4', 'gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM máy trưởng hạng ba phải bảo đảm điều kiện cụ thể sau:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_4_a1', 'gk_ltc_4', 'Đủ 18 tuổi trở lên, có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_4_a2', 'gk_ltc_4', 'Đủ 20 tuổi trở lên, có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy,') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_4_a3', 'gk_ltc_4', 'Đủ 18 tuổi trở lên, có chứng chỉ thợ máy, có thời gian đảm nhiệm chức danh thợ máy đủ 12 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_4_a4', 'gk_ltc_4', 'Đủ 20 tuổi trở lên, có chứng chỉ thợ máy, có thời gian đảm nhiệm chức danh thợ máy đủ 12 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_4_a3' WHERE id = 'gk_ltc_4';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_5', 'gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM thuyền trưởng hạng nhất phải bảo đảm điều kiện cụ thể sau:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_5_a1', 'gk_ltc_5', 'Có bằng tốt nghiệp trung cấp được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoàn thành thời gian tập sự theo chức danh thuyền trưởng hạng ba đủ 12 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_5_a2', 'gk_ltc_5', 'Có bằng tốt nghiệp trung học phổ thông hoặc tương đương trở lên, có GCNKNCM thuyền trưởng hạng nhì, có thời gian đảm nhiệm chức danh thuyền trưởng hạng nhì hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhất đủ 24 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_5_a3', 'gk_ltc_5', 'Có bằng tốt nghiệp trung cấp được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoàn thành thời gian tập sự theo chức danh thuyền trưởng hạng ba đủ 18 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_5_a4', 'gk_ltc_5', 'Đủ 22 tuổi trở lên, có GCNKNCM thuyền trưởng hạng nhì, có thời gian đảm nhiệm chức danh thuyền trưởng hạng nhì hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhất đủ 24 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_5_a2' WHERE id = 'gk_ltc_5';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_6', 'gk-lt-chung', 'Ai có thẩm quyền xử lý vi phạm đối với thành viên Ban coi thi, chấm thi, coi kiểm tra, chấmkiểm tra:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_6_a1', 'gk_ltc_6', 'Bộ GTVT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_6_a2', 'gk_ltc_6', 'Cơ sở đào tạo') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_6_a3', 'gk_ltc_6', 'Cục Hàng hải và Đường thủy Việt Nam') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_6_a4', 'gk_ltc_6', 'Chủ tịch Hội đồng thi, kiểm tra') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_6_a3' WHERE id = 'gk_ltc_6';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_7', 'gk-lt-chung', 'Thời gian thi môn lý thuyết tổng hợp (trắc nghiệm ) tối đa:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_7_a1', 'gk_ltc_7', '90 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_7_a2', 'gk_ltc_7', '30 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_7_a3', 'gk_ltc_7', '60 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_7_a4', 'gk_ltc_7', '45 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_7_a4' WHERE id = 'gk_ltc_7';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_8', 'gk-lt-chung', 'Thời gian thi môn thực hành thuyền trưởng hạng nhất tối đa:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_8_a1', 'gk_ltc_8', '45 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_8_a2', 'gk_ltc_8', '60 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_8_a3', 'gk_ltc_8', '120 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_8_a4', 'gk_ltc_8', '90 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_8_a3' WHERE id = 'gk_ltc_8';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_9', 'gk-lt-chung', 'Giám khảo giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 06 tháng khi vi phạm quy định nào dưới đây:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_9_a1', 'gk_ltc_9', 'Để xảy ra xô xát, va chạm, tai nạn trong khi coi thi, chấm thi, coi kiểm tra, chấm kiểm tra do nguyên nhân chủ quan;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_9_a2', 'gk_ltc_9', 'Bao che cho những hành vi sai phạm, tiêu cực;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_9_a3', 'gk_ltc_9', 'Không kiểm tra kỹ bài thi, kiểm tra dẫn đến thiếu sót các nội dung liên quan bài thi, kiểm tra khi bàn giao bài thi, kiểm tra cho thư ký Hội đồng thi, kiểm tra.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_9_a4', 'gk_ltc_9', 'Làm việc riêng, uống rượu, bia hoặc sử dụng các chất kích thích khác mà pháp luật cấm sử dụng trong khi tham gia công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_9_a1' WHERE id = 'gk_ltc_9';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_10', 'gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_10_a1', 'gk_ltc_10', 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển, đã tham gia giảng dạy hoặc làm việc trong lĩnh vực đường thủy nội địa từ 12 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_10_a2', 'gk_ltc_10', 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_10_a3', 'gk_ltc_10', 'Có chứng chỉ A tin học và Tốt nghiệp trung cấp trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_10_a4', 'gk_ltc_10', 'Tốt nghiệp trung cấp trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_10_a4' WHERE id = 'gk_ltc_10';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_11', 'gk-lt-chung', 'Giám khảo, giám thị hoạt động dưới sự điều hành của:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_11_a1', 'gk_ltc_11', 'Cơ sở đào tạo') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_11_a2', 'gk_ltc_11', 'Hội đồng thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_11_a3', 'gk_ltc_11', 'Chi cục Hàng hải và Đường thủy Việt Nam') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_11_a4', 'gk_ltc_11', 'Cục Hàng hải và Đường thủy Việt Nam') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_11_a2' WHERE id = 'gk_ltc_11';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_12', 'gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra Môn lý thuyết chuyên môn là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_12_a1', 'gk_ltc_12', 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển, đã tham gia giảng dạy hoặc làm việc trong lĩnh vực đường thủy nội địa từ 12 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_12_a2', 'gk_ltc_12', 'Có chứng chỉ B tin học và Tốt nghiệp trung cấp trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_12_a3', 'gk_ltc_12', 'Tốt nghiệp trung cấp trở lên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_12_a4', 'gk_ltc_12', 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển, đã tham gia giảng dạy hoặc làm việc trong lĩnh vực đường thủy nội địa từ 24 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_12_a1' WHERE id = 'gk_ltc_12';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_13', 'gk-lt-chung', 'Theo quy định hiện hành thời gian lưu trữ bài thi, kiểm tra:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_13_a1', 'gk_ltc_13', 'Tối thiểu 02 năm;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_13_a2', 'gk_ltc_13', 'Tối thiểu 03 năm;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_13_a3', 'gk_ltc_13', 'Tối thiểu 01 năm;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_13_a4', 'gk_ltc_13', 'Tối thiểu 04 năm.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_13_a1' WHERE id = 'gk_ltc_13';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_14', 'gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn thực hành thuyền trưởng hạng 2 (T2) là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_14_a1', 'gk_ltc_14', 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên và có GCNKNCM thuyền trưởng hạng 1 (T1);') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_14_a2', 'gk_ltc_14', 'Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 24 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_14_a3', 'gk_ltc_14', 'Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 12 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_14_a4', 'gk_ltc_14', 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên hoặc Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 12tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_14_a1' WHERE id = 'gk_ltc_14';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_15', 'gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM máy trưởng hạng nhất phải bảo đảm điều kiện cụ thể sau:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_15_a1', 'gk_ltc_15', 'Có bằng tốt nghiệp trung cấp được đào tạo nghề máy tàu thủy hoặc máy tàu biển, hoàn thành thời gian tập sự theo chức danh máy trưởng hạng ba đủ 06 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_15_a2', 'gk_ltc_15', 'Đủ 22 tuổi trở lên, có GCNKNCM máy trưởng hạng nhì, có thời gian đảm nhiệm chức danh máy trưởng hạng nhì hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhất đủ 18 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_15_a3', 'gk_ltc_15', 'Có bằng tốt nghiệp trung học phổ thông hoặc tương đương trở lên, có GCNKNCM máy trưởng hạng nhì, có thời gian đảm nhiệm chức danh máy trưởng hạng nhì hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhất đủ 18 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_15_a4', 'gk_ltc_15', 'Có bằng tốt nghiệp trung cấp được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoàn thành thời gian tập sự theo chức danh thuyền trưởng hạng ba đủ 12 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_15_a3' WHERE id = 'gk_ltc_15';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_16', 'gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM máy trưởng hạng nhì phải bảo đảm điều kiện cụ thể sau:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_16_a1', 'gk_ltc_16', 'Đủ 20 tuổi trở lên, có GCNKNCM máy trưởng hạng ba, có thời gian đảm nhiệm chức danh máy trưởng hạng ba hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhì đủ 06 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_16_a2', 'gk_ltc_16', 'Có GCNKNCM máy trưởng hạng ba, có thời gian đảm nhiệm chức danh máy trưởng hạng ba hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhì đủ 12 tháng trở lên hoặc có chứng chỉ sơ cấp nghề máy trưởng hạng ba, có thời gian tập sự đủ 06 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_16_a3', 'gk_ltc_16', 'Có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy, hoàn thành thời gian tập sự đủ 12 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_16_a4', 'gk_ltc_16', 'Có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy, hoàn thành thời gian tập sự đủ 06 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_16_a2' WHERE id = 'gk_ltc_16';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_17', 'gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là M.LTCM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_17_a1', 'gk_ltc_17', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành máy phương tiện và môn lý thuyết tổng hợp;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_17_a2', 'gk_ltc_17', 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_17_a3', 'gk_ltc_17', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành điều khiển phương tiện và môn lý thuyết tổng hợp;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_17_a4', 'gk_ltc_17', 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_17_a1' WHERE id = 'gk_ltc_17';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_18', 'gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM thuyền trưởng hạng nhì phải bảo đảm điều kiện cụ thể sau:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_18_a1', 'gk_ltc_18', 'Có GCNKNCM thuyền trưởng hạng ba, có thời gian đảm nhiệm chức danh thuyền trưởng hạng ba hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhì đủ 18 tháng trở lên hoặc có chứng chỉ sơ cấp nghề thuyền trưởng hạng ba, có thời gian tập sự đủ 12 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_18_a2', 'gk_ltc_18', 'Đủ 20 tuổi trở lên, có GCNKNCM thuyền trưởng hạng ba, có thời gian đảm nhiệm chức danh thuyền trưởng hạng ba hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhì đủ 12 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_18_a3', 'gk_ltc_18', 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoặc nghề thủy thủ, hoàn thành thời gian tập sự đủ 12 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_18_a4', 'gk_ltc_18', 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoặc nghề thủy thủ, hoàn thành thời gian tập sự đủ 18 tháng trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_18_a1' WHERE id = 'gk_ltc_18';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_19', 'gk-lt-chung', 'Theo quy định hiện hành cơ quan nào ra quyết định công nhận kết quả thi, cấp, cấp lại, chuyển đổi GCNKNCM thuyền trưởng, máy trưởng:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_19_a1', 'gk_ltc_19', 'Cục Hàng hải và Đường thủy Việt Nam;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_19_a2', 'gk_ltc_19', 'Cơ sở đào tạo.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_19_a3', 'gk_ltc_19', 'Bộ Xây dựng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_19_a4', 'gk_ltc_19', 'Sở Xây dựng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_19_a4' WHERE id = 'gk_ltc_19';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_20', 'gk-lt-chung', 'Giám khảo, giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 03 tháng khi vi phạm quy định nào dưới đây:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_20_a1', 'gk_ltc_20', 'Không báo cáo Trưởng ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đề nghị Hội đồng thi, kiểm tra điều chỉnh kịp thời khi phát hiện sai sót trong đề thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_20_a2', 'gk_ltc_20', 'Trợ giúp thí sinh dưới mọi hình thức;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_20_a3', 'gk_ltc_20', 'Tự ý làm những công việc không được phân công;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_20_a4', 'gk_ltc_20', 'Tất cả các trường hợp trên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_20_a3' WHERE id = 'gk_ltc_20';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_21', 'gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM thuyền trưởng hạng ba phải bảo đảm điều kiện cụ thể sau:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_21_a1', 'gk_ltc_21', 'Đủ 18 tuổi trở lên, có chứng chỉ thủy thủ hoặc chứng chỉ lái phương tiện, có thời gian đảm nhiệm chức danh đủ 12 tháng trở lên hoặc có GCNKNCM thuyền trưởng hạng tư, có thời gian đảm nhiệm chức danh thủy thủ hoặc người lái phương tiện đủ 06 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_21_a2', 'gk_ltc_21', 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoặc nghề thủy thủ, hoàn thành thời gian tập sự đủ 12 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_21_a3', 'gk_ltc_21', 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_21_a4', 'gk_ltc_21', 'Đủ 20 tuổi trở lên, có chứng chỉ thủy thủ hoặc chứng chỉ lái phương tiện, có thời gian đảm nhiệm chức danh đủ 06 tháng trở lên hoặc có GCNKNCM thuyền trưởng hạng tư, có thời gian đảm nhiệm chức danh thủy thủ hoặc người lái phương tiện đủ 06 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_21_a1' WHERE id = 'gk_ltc_21';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_22', 'gk-lt-chung', 'Người có văn bằng, chứng chỉ thuyền trưởng, máy trưởng tàu cá hạng II, có thời gian đảm nhiệm theo chức danh thuyền trưởng, máy trưởng tàu cá hạng II đủ 18 tháng trở lên được chuyển đổi sang GCNKNCM thuyền trưởng, máy trưởng loại nào:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_22_a1', 'gk_ltc_22', 'GCNKNCM thuyền trưởng, máy trưởng hạng ba chỉ dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_22_a2', 'gk_ltc_22', 'GCNKNCM thuyền trưởng, máy trưởng hạng nhì, chỉ dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_22_a3', 'gk_ltc_22', 'GCNKNCM thuyền trưởng, máy trưởng hạng ba nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng với thuyền trưởng, máy trưởng hạng ba, dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_22_a4', 'gk_ltc_22', 'GCNKNCM thuyền trưởng, máy trưởng hạng nhất nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng với thuyền trưởng, máy trưởng hạng ba, dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_22_a3' WHERE id = 'gk_ltc_22';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_23', 'gk-lt-chung', 'Quyền hạn của người giám sát kỳ thi, kiểm tra:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_23_a1', 'gk_ltc_23', 'Khi phát hiện sai phạm phải lập biên bản;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_23_a2', 'gk_ltc_23', 'Đề nghị Hội đồng thi, kiểm tra xử lý kịp thời, đúng quy định;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_23_a3', 'gk_ltc_23', 'Báo cáo Sở Xây dựng để xem xét, xử lý') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_23_a4', 'gk_ltc_23', 'Tất cả các ý trên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_23_a4' WHERE id = 'gk_ltc_23';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_24', 'gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là T.LTCM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_24_a1', 'gk_ltc_24', 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_24_a2', 'gk_ltc_24', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành máy phương tiện và môn lý thuyết tổng hợp;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_24_a3', 'gk_ltc_24', 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_24_a4', 'gk_ltc_24', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành điều khiển phương tiện và môn lý thuyết tổng hợp;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_24_a4' WHERE id = 'gk_ltc_24';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_25', 'gk-lt-chung', 'Thời gian thi môn thực hành thuyền trưởng hạng ba tối đa:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_25_a1', 'gk_ltc_25', '60 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_25_a2', 'gk_ltc_25', '45 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_25_a3', 'gk_ltc_25', '120 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_25_a4', 'gk_ltc_25', '90 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_25_a1' WHERE id = 'gk_ltc_25';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_26', 'gk-lt-chung', 'Theo quy định hiện hành cơ quan nào ra Quyết định công nhận kết quả kiểm tra, cấp, cấp lại, chuyển đổi CCCM đặc biệt:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_26_a1', 'gk_ltc_26', 'Cơ sở đào tạo.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_26_a2', 'gk_ltc_26', 'Cục Hàng hải và Đường thủy Việt Nam;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_26_a3', 'gk_ltc_26', 'Sở Xây dựng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_26_a4', 'gk_ltc_26', 'Bộ Xây dựng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_26_a3' WHERE id = 'gk_ltc_26';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_27', 'gk-lt-chung', 'Giám khảo, giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 03 tháng khi vi phạm quy định nào dưới đây:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_27_a1', 'gk_ltc_27', 'Để xảy ra xô xát, va chạm, tai nạn trong khi coi thi, chấm thi, coi kiểm tra, chấm kiểm tra do nguyên nhân chủ quan;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_27_a2', 'gk_ltc_27', 'Không tập hợp kết quả chấm thi, kiểm tra và bàn giao cho thư ký Hội đồng thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_27_a3', 'gk_ltc_27', 'Không kiểm tra việc chấp hành nội quy thi, kiểm tra; danh sách thí sinh dự thi, kiểm tra; điều kiện an toàn phòng thi, kiểm tra; điều kiện an toàn của phương tiện, thiết bị phục vụ kỳ thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_27_a4', 'gk_ltc_27', 'Tất cả các trường hợp trên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_27_a3' WHERE id = 'gk_ltc_27';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_28', 'gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn thực hành tuyền trưởng hạng 1 (T1) là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_28_a1', 'gk_ltc_28', 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên và có GCNKNCM thuyền trưởng hạng 1 (T1);') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_28_a2', 'gk_ltc_28', 'Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 24 tháng trở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_28_a3', 'gk_ltc_28', 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên, Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 24 thángtrở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_28_a4', 'gk_ltc_28', 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên, Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 12 thángtrở lên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_28_a3' WHERE id = 'gk_ltc_28';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_29', 'gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là T.TH2') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_29_a1', 'gk_ltc_29', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng nhì;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_29_a2', 'gk_ltc_29', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng ba;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_29_a3', 'gk_ltc_29', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng ba;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_29_a4', 'gk_ltc_29', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng nhì;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_29_a2' WHERE id = 'gk_ltc_29';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_30', 'gk-lt-chung', 'Những ai sau đây khi thực hiện công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra phải hoàn thành lớp tập huấn nghiệp vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đạt yêu cầu do Cục Hàng hải và Đường thủy Việt Nam tổ chức :') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_30_a1', 'gk_ltc_30', 'Thành viên ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_30_a2', 'gk_ltc_30', 'Thư ký đồng thi, kiểm tra') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_30_a3', 'gk_ltc_30', 'Tất cả các trường hợp trên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_30_a4', 'gk_ltc_30', 'Hội đồng thi,kiểm tra') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_30_a1' WHERE id = 'gk_ltc_30';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_31', 'gk-lt-chung', 'Ai có thẩm quyền đình chỉ thực hiện nhiệm vụ, coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đối với thành viên Ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_31_a1', 'gk_ltc_31', 'Cục Hàng hải và Đường thủy Việt Nam') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_31_a2', 'gk_ltc_31', 'Cơ sở đào tạo') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_31_a3', 'gk_ltc_31', 'Bộ GTVT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_31_a4', 'gk_ltc_31', 'Chủ tịch Hội đồng thi, kiểm tra') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_31_a4' WHERE id = 'gk_ltc_31';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_32', 'gk-lt-chung', 'Theo quy định hiện hành trong thời hạn bao lâu, kể từ ngày khai giảng, cơ sở đào tạo báo cáo Sở Xây dựng Danh sách học viên đủ điều kiện dự học:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_32_a1', 'gk_ltc_32', '01 (một) ngày làm việc;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_32_a2', 'gk_ltc_32', '05 (năm) ngày làm việc;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_32_a3', 'gk_ltc_32', '07 (bảy) ngày làm việc.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_32_a4', 'gk_ltc_32', '03 (ba) ngày làm việc;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_32_a4' WHERE id = 'gk_ltc_32';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_33', 'gk-lt-chung', 'Giám khảo giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 06 tháng khi vi phạm một trong các quy định dưới đây:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_33_a1', 'gk_ltc_33', 'Làm việc riêng, uống rượu, bia hoặc sử dụng các chất kích thích khác mà pháp luật cấm sử dụng trong khi tham gia công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_33_a2', 'gk_ltc_33', 'Không kiểm tra kỹ bài thi, kiểm tra dẫn đến thiếu sót các nội dung liên quan bài thi, kiểm tra khi bàn giao bài thi, kiểm tra cho thư ký Hội đồng thi, kiểm tra.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_33_a3', 'gk_ltc_33', 'Không tập hợp kết quả chấm thi, kiểm tra và bàn giao cho thư ký Hội đồng thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_33_a4', 'gk_ltc_33', 'Bao che cho những hành vi sai phạm, tiêu cực;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_33_a3' WHERE id = 'gk_ltc_33';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_34', 'gk-lt-chung', 'Đối với môn thi lý thuyết tổng hợp (trắc nghiệm) mỗi đề có:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_34_a1', 'gk_ltc_34', '30 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_34_a2', 'gk_ltc_34', '20 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_34_a3', 'gk_ltc_34', '60 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_34_a4', 'gk_ltc_34', '15 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_34_a1' WHERE id = 'gk_ltc_34';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_35', 'gk-lt-chung', 'Thời gian thi môn thực hành thuyền trưởng hạng nhì tối đa:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_35_a1', 'gk_ltc_35', '120 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_35_a2', 'gk_ltc_35', '45 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_35_a3', 'gk_ltc_35', '60 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_35_a4', 'gk_ltc_35', '90 phút') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_35_a4' WHERE id = 'gk_ltc_35';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_36', 'gk-lt-chung', 'Theo quy định hiện hành trong thời hạn bao lâu, trước khi tổ chức kiểm tra cấp CCCM, cơ sở đào tạo báo cáo bằng văn bản về Sở Xây dựng để giám sát các kỳ kiểm tra:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_36_a1', 'gk_ltc_36', '07 (bảy) ngày làm việc;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_36_a2', 'gk_ltc_36', '10 (mười) ngày làm việc.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_36_a3', 'gk_ltc_36', '') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_36_a4', 'gk_ltc_36', '09 (chín) ngày làm việc;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_36_a2' WHERE id = 'gk_ltc_36';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_37', 'gk-lt-chung', 'Theo quy định hiện hành cơ quan nào ra quyết định công nhận kết quả kiểm tra, cấp, cấp lại, chuyển đổi chứng chỉ nghiệp vụ:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_37_a1', 'gk_ltc_37', 'Cục Hàng hải và Đường thủy Việt Nam;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_37_a2', 'gk_ltc_37', 'Sở Xây dựng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_37_a3', 'gk_ltc_37', 'Cơ sở đào tạo.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_37_a4', 'gk_ltc_37', 'Bộ Xây dựng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_37_a3' WHERE id = 'gk_ltc_37';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_38', 'gk-lt-chung', 'Giám khảo giám thị bị hủy kết quả công nhận thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra khi:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_38_a1', 'gk_ltc_38', 'Có biểu hiện tiêu cực làm sai lệch kết quả thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_38_a2', 'gk_ltc_38', 'Bao che cho những hành vi sai phạm, tiêu cực;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_38_a3', 'gk_ltc_38', 'Hai lần vi phạm không thực hiện đúng nội dung, quy trình và thủ tục của kỳ thi, kiểm tra theo quy định hiện hành;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_38_a4', 'gk_ltc_38', 'Hai lần vi phạm trợ giúp thí sinh dưới mọi hình thức;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_38_a3' WHERE id = 'gk_ltc_38';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_39', 'gk-lt-chung', 'Người có bằng tố nghiệp cao đẳng trở lên được đào tạo nghề điều khiển tàu biển, có GCNKNCM thuyền trưởng tàu biển từ 500 GT trở lên, có thời gian đảm nhiệm theo chức danh thuyền trưởng tàu biển tương ứng đủ 06 tháng trở lên được chuyển đổi sang:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_39_a1', 'gk_ltc_39', 'GCNKNCM thuyền trưởng hạng nhất phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_39_a2', 'gk_ltc_39', 'GCNKNCM thuyền trưởng hạng nhì phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_39_a3', 'gk_ltc_39', 'GCNKNCM thuyền trưởng hạng tư phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_39_a4', 'gk_ltc_39', 'GCNKNCM thuyền trưởng hạng ba phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_39_a1' WHERE id = 'gk_ltc_39';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_40', 'gk-lt-chung', 'Người có chứng chỉ thủy thủ, thợ máy tàu biển được chuyển đổi tương ứng sang:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_40_a1', 'gk_ltc_40', 'Chứng chỉ thủy thủ, chứng chỉ lái phương tiện, chứng chỉ thợ máy phương tiện thủy nội địa nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_40_a2', 'gk_ltc_40', 'Chứng chỉ thủy thủ, thợ máy phương tiện thủy nội địa nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_40_a3', 'gk_ltc_40', 'Chứng chỉ thủy thủ, thợ máy phương tiện thủy nội địa và được cấp chứng chỉ an toàn làm việc trên phương tiện đi ven biển;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_40_a4', 'gk_ltc_40', 'Chứng chỉ thủy thủ, chứng chỉ lái phương tiện, chứng chỉ thợ máy phương tiện thủy nội địa;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_40_a3' WHERE id = 'gk_ltc_40';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_41', 'gk-lt-chung', 'Giám khảo, giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tratrong thời hạn 03 tháng khi vi phạm quy định nào dưới đây:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_41_a1', 'gk_ltc_41', 'Có thái độ, hành vi ứng xử không đúng mực khi tham gia công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_41_a2', 'gk_ltc_41', 'Không báo cáo Trưởng ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đề nghị Hội đồng thi, kiểm tra điều chỉnh kịp thời khi phát hiện sai sót trong đề thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_41_a3', 'gk_ltc_41', 'Trợ giúp thí sinh dưới mọi hình thức;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_41_a4', 'gk_ltc_41', 'Tất cả các trường hợp trên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_41_a1' WHERE id = 'gk_ltc_41';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_42', 'gk-lt-chung', 'Nhiệm vụ của Ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_42_a1', 'gk_ltc_42', 'Coi thi, chấm thi, coi kiểm tra, chấm kiểm tra theo đúng quy định; Tập hợp kết quả chấm thi, kiểm tra và bàn giao cho Thư ký Hội đồng thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_42_a2', 'gk_ltc_42', 'Đề nghị Hội đồng thi, kiểm tra điều chỉnh kịp thời nếu phát hiện sai sót trong đề thi, kiểm tra;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_42_a3', 'gk_ltc_42', 'Tổ chức, bố trí, sắp xếp thành viên Ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra bảo đảm nguyên tắc mỗi môn thi, kiểm tra phải có tối thiểu 02 (hai) thành viên;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_42_a4', 'gk_ltc_42', 'Tất cả các ý trên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_42_a4' WHERE id = 'gk_ltc_42';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_43', 'gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là LTTH') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_43_a1', 'gk_ltc_43', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_43_a2', 'gk_ltc_43', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_43_a3', 'gk_ltc_43', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_43_a4', 'gk_ltc_43', 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra tất cả các loại hạng;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_43_a3' WHERE id = 'gk_ltc_43';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_44', 'gk-lt-chung', 'Chứng chỉ nghiệp vụ, bao gồm:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_44_a1', 'gk_ltc_44', 'Chứng chỉ thủy thủ (TT); Chứng chỉ thợ máy (TM); Chứng chỉ lái phương tiện (LPT).') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_44_a2', 'gk_ltc_44', 'Chứng chỉ thủy thủ hạng nhất (TT1); Chứng chỉ thủy thủ hạng nhì (TT2; Chứng chỉ thợ máy hạng nhất (TM1); Chứng chỉ thợ máy hạng nhì (TM2); Chứng chỉ lái phương tiện hạng nhất (LPT1). Chứng chỉ lái phương tiện hạng nhì (LPT2).') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_44_a3', 'gk_ltc_44', 'Chứng chỉ thủy thủ (TT); Chứng chỉ thợ máy (TM); Chứng chỉ lái phương tiện hạng nhất (LPT1).') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_44_a4', 'gk_ltc_44', 'Chứng chỉ thủy thủ (TT); Chứng chỉ thợ máy (TM); Chứng chỉ lái phương tiện (LPT). Chứng chỉ an toàn cơ bản (ATCB)') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_44_a1' WHERE id = 'gk_ltc_44';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_45', 'gk-lt-chung', 'Đối với môn thi lý thuyết tổng hợp (trắc nghiệm) làm đúng bao nhiêu câu trở lên thì đạt yêucầu:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_45_a1', 'gk_ltc_45', '15 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_45_a2', 'gk_ltc_45', '27 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_45_a3', 'gk_ltc_45', '20 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_45_a4', 'gk_ltc_45', '25 câu hỏi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_45_a4' WHERE id = 'gk_ltc_45';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_46', 'gk-lt-chung', 'Cơ sở đào tạo bị thu hồi Giấy chứng nhận trong các trường hợp sau :') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_46_a1', 'gk_ltc_46', 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 12 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_46_a2', 'gk_ltc_46', 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 12 tháng và theo các quy định khác có liên quan của pháp luật.;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_46_a3', 'gk_ltc_46', 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 18 tháng và theo các quy định khác có liên quan của pháp luật;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_46_a4', 'gk_ltc_46', 'Không có trường hợp nào cả') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_46_a2' WHERE id = 'gk_ltc_46';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_47', 'gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 3:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_47_a1', 'gk_ltc_47', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_47_a2', 'gk_ltc_47', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_47_a3', 'gk_ltc_47', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_47_a4', 'gk_ltc_47', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_47_a1' WHERE id = 'gk_ltc_47';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_48', 'gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 4:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_48_a1', 'gk_ltc_48', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_48_a2', 'gk_ltc_48', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_48_a3', 'gk_ltc_48', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_48_a4', 'gk_ltc_48', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_48_a1' WHERE id = 'gk_ltc_48';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_49', 'gk-lt-chung', 'Cơ sở đào tạo bị thu hồi Giấy chứng nhận trong các trường hợp sau :') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_49_a1', 'gk_ltc_49', 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 12 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_49_a2', 'gk_ltc_49', 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 18 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_49_a3', 'gk_ltc_49', 'Không có trường hợp nào cả') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_49_a4', 'gk_ltc_49', 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 18 tháng và theo các quy định khác có liên quan của pháp luật;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_49_a2' WHERE id = 'gk_ltc_49';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_50', 'gk-lt-chung', 'Cơ sở kinh doanh dịch vụ đào tạo thuyền viên, người lái phương tiện thủy nội địa được chiathành mấy loại:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_50_a1', 'gk_ltc_50', '2 loại;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_50_a2', 'gk_ltc_50', '4 loại;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_50_a3', 'gk_ltc_50', '5 loại;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_50_a4', 'gk_ltc_50', '3 loại;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_50_a2' WHERE id = 'gk_ltc_50';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_51', 'gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 1:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_51_a1', 'gk_ltc_51', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_51_a2', 'gk_ltc_51', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_51_a3', 'gk_ltc_51', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_51_a4', 'gk_ltc_51', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_51_a4' WHERE id = 'gk_ltc_51';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_52', 'gk-lt-chung', 'Giáo viên dạy thực hành thuyền trưởng hạng ba phải:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_52_a1', 'gk_ltc_52', 'Có giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng nào cũng được') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_52_a2', 'gk_ltc_52', 'Có giấy chứng nhận khả năng chuyên môn máytrưởng hạng nhì trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_52_a3', 'gk_ltc_52', 'Có giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng ba trở lên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_52_a4', 'gk_ltc_52', 'Có giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng nhì trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_52_a4' WHERE id = 'gk_ltc_52';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_53', 'gk-lt-chung', 'Cơ sở đào tạo bị thu hồi Giấy chứng nhận trong các trường hợp sau :') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_53_a1', 'gk_ltc_53', 'Khi đã hết thời hạn bị đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa mà không khắc phục được các vi phạm là nguyên nhân dẫn đến việc bị đình chỉ;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_53_a2', 'gk_ltc_53', 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 18 tháng và theo các quy định khác có liên quan của pháp luật;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_53_a3', 'gk_ltc_53', 'Không có trường hợp nào cả') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_53_a4', 'gk_ltc_53', 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 12 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_53_a1' WHERE id = 'gk_ltc_53';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_54', 'gk-lt-chung', 'Sở Xây dựng có trách nhiệm tổ chức cấp, cấp lại, thu hồi Giấy chứng nhận cơ sở đủ điều kiện kinh doanh dịch vụ đào tạo thuyền viên, người lái phương tiện thủy nội địa đối với:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_54_a1', 'gk_ltc_54', 'Cơ sở loại 4 trong phạm vi địa phương') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_54_a2', 'gk_ltc_54', 'Cơ sở loại 3 trong phạm vi địa phương') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_54_a3', 'gk_ltc_54', 'Cơ sở loại 2 trong phạm vi địa phương') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_54_a4', 'gk_ltc_54', 'Cơ sở loại 1 trong phạm vi địa phương') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_54_a1' WHERE id = 'gk_ltc_54';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_55', 'gk-lt-chung', 'Ủy ban nhân dân cấp tỉnh có trách nhiệm tổ chức cấp, cấp lại, thu hồi Giấy chứng nhận cơ sở đủ điều kiện kinh doanh dịch vụ đào tạo thuyền viên, người lái phương tiện thủy nội địa đối với:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_55_a1', 'gk_ltc_55', 'Cơ sở loại 1 trong phạm vi địa bàn quản lý') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_55_a2', 'gk_ltc_55', 'Cơ sở loại 2 trở lên trong phạm vi địa bàn quản lý') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_55_a3', 'gk_ltc_55', 'Cơ sở loại 3 trở lên trong phạm vi địa bàn quản lý') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_55_a4', 'gk_ltc_55', 'Cơ sở loại 4 trở lên trong phạm vi địa bàn quản lý') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_55_a3' WHERE id = 'gk_ltc_55';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_56', 'gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 2:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_56_a1', 'gk_ltc_56', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_56_a2', 'gk_ltc_56', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_56_a3', 'gk_ltc_56', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_56_a4', 'gk_ltc_56', 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_56_a3' WHERE id = 'gk_ltc_56';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_57', 'gk-lt-chung', 'Thời gian thực học thực hành nghề tối thiểu chiếm bao nhiêu phần trăm tổng thời gian khóa học trong chương trình đào tạo thường xuyên:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_57_a1', 'gk_ltc_57', '50%') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_57_a2', 'gk_ltc_57', '60%') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_57_a3', 'gk_ltc_57', '80%') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_57_a4', 'gk_ltc_57', '70%') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_57_a3' WHERE id = 'gk_ltc_57';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_58', 'gk-lt-chung', 'Theo quy định hiện hành về đào tạo thường xuyên, số lượng học viên tối đa đối với lớp học kiến thức nghề là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_58_a1', 'gk_ltc_58', '25 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_58_a2', 'gk_ltc_58', '40 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_58_a3', 'gk_ltc_58', '35 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_58_a4', 'gk_ltc_58', '30 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_58_a3' WHERE id = 'gk_ltc_58';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_59', 'gk-lt-chung', 'Học viên không đạt yêu cầu khi kiểm tra kết thúc mô - đun, môn học trong đào tạo thường xuyên, thì được kiểm tra lại tối đa là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_59_a1', 'gk_ltc_59', 'Không được kiểm tra lại') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_59_a2', 'gk_ltc_59', '03 lần') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_59_a3', 'gk_ltc_59', '02 lần') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_59_a4', 'gk_ltc_59', '01 lần') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_59_a3' WHERE id = 'gk_ltc_59';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_60', 'gk-lt-chung', 'Thời gian học mỗi buổi tối đa là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_60_a1', 'gk_ltc_60', '6 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_60_a2', 'gk_ltc_60', '5 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_60_a3', 'gk_ltc_60', '4 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_60_a4', 'gk_ltc_60', '3 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_60_a2' WHERE id = 'gk_ltc_60';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_61', 'gk-lt-chung', 'Kiểm tra đầu khóa học đối với học viên trong đào tạo thường xuyên để:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_61_a1', 'gk_ltc_61', 'Xét tuyển đầu vào') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_61_a2', 'gk_ltc_61', 'Lấy điểm điều kiện dự thi cuối khóa') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_61_a3', 'gk_ltc_61', 'Cả a và b') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_61_a4', 'gk_ltc_61', 'Chuẩn bị nội dung, phương pháp giảng dạy phù hợp') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_61_a4' WHERE id = 'gk_ltc_61';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_62', 'gk-lt-chung', 'Nội dung, hình thức và điều kiện kiểm tra khi kết thúc mô - đun, môn học trong đào tạo thường xuyên:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_62_a1', 'gk_ltc_62', 'Do người đứng đầu cơ sở đào tạo quyết định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_62_a2', 'gk_ltc_62', 'Do giáo viên trực tiếp giảng dạy quyết định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_62_a3', 'gk_ltc_62', 'Do người phụ trách đào tạo của cơ sở đào tạo quyết định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_62_a4', 'gk_ltc_62', 'Cả b và c') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_62_a1' WHERE id = 'gk_ltc_62';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_63', 'gk-lt-chung', 'Thời gian đào tạo đối với các chương trình đào tạo thường xuyên là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_63_a1', 'gk_ltc_63', 'Thời gian thực học kiến thức nghề, kỹ năng mềm') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_63_a2', 'gk_ltc_63', 'Thời gian thực học thực hành nghề') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_63_a3', 'gk_ltc_63', 'Thời gian kiểm tra trước, trong quá trình đào tạo, kiểm tra kết thúc khóa học') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_63_a4', 'gk_ltc_63', 'Cả ba ý trên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_63_a4' WHERE id = 'gk_ltc_63';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_64', 'gk-lt-chung', 'Nội dung, phương pháp kiểm tra đầu khóa học đối với học viên trong đào tạo thường xuyên:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_64_a1', 'gk_ltc_64', 'Do giáo viên trực tiếp giảng dạy lựa chọn, quyết định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_64_a2', 'gk_ltc_64', 'Do người đứng đầu cơ sở đào tạo lựa chọn, quyết định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_64_a3', 'gk_ltc_64', 'Do người phụ trách đào tạo của cơ sở đào tạo lựa chọn, quyết định') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_64_a4', 'gk_ltc_64', 'Cả b và c') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_64_a1' WHERE id = 'gk_ltc_64';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_65', 'gk-lt-chung', 'Theo quy định hiện hành về đào tạo thường xuyên, số lượng học viên tối đa đối với lớp học thực hành nghề là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_65_a1', 'gk_ltc_65', '28 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_65_a2', 'gk_ltc_65', '18 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_65_a3', 'gk_ltc_65', '25 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_65_a4', 'gk_ltc_65', '15 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_65_a2' WHERE id = 'gk_ltc_65';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_66', 'gk-lt-chung', 'Kết quả kiểm tra khi kết thúc mô - đun, môn học trong đào tạo thường xuyên được đánh giá theo:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_66_a1', 'gk_ltc_66', 'Một trong hai mức: Đạt yêu cầu và Không đạt yêu cầu') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_66_a2', 'gk_ltc_66', 'Thang điểm 10') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_66_a3', 'gk_ltc_66', 'Thang điểm 100') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_66_a4', 'gk_ltc_66', 'Cả ba đáp án trên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_66_a1' WHERE id = 'gk_ltc_66';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_67', 'gk-lt-chung', 'Theo quy định hiện hành về đào tạo thường xuyên, số lượng học viên tối đa đối với lớp học tích hợp là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_67_a1', 'gk_ltc_67', '25 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_67_a2', 'gk_ltc_67', '28 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_67_a3', 'gk_ltc_67', '18 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_67_a4', 'gk_ltc_67', '15 học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_67_a3' WHERE id = 'gk_ltc_67';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_68', 'gk-lt-chung', 'Thời gian học trong một ngày tối đa là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_68_a1', 'gk_ltc_68', '7 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_68_a2', 'gk_ltc_68', '5 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_68_a3', 'gk_ltc_68', '8 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_68_a4', 'gk_ltc_68', '6 giờ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_68_a3' WHERE id = 'gk_ltc_68';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_69', 'gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 4 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_69_a1', 'gk_ltc_69', '10 m ÷ 20 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_69_a2', 'gk_ltc_69', '20 m ÷ 30 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_69_a3', 'gk_ltc_69', '5 m ÷ 10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_69_a4', 'gk_ltc_69', '≤10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_69_a4' WHERE id = 'gk_ltc_69';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_70', 'gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 4 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_70_a1', 'gk_ltc_70', '≤2 KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_70_a2', 'gk_ltc_70', '≤1 KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_70_a3', 'gk_ltc_70', '≥2 KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_70_a4', 'gk_ltc_70', '≥1 KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_70_a2' WHERE id = 'gk_ltc_70';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_71', 'gk-lt-chung', 'Việc lắp đặt camera giám sát trong phòng thi, phòng kiểm tra là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_71_a1', 'gk_ltc_71', 'Bắt buộc theo quy định.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_71_a2', 'gk_ltc_71', 'Theo yêu cầu của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_71_a3', 'gk_ltc_71', 'Theo điều kiện của cơ sở đào tạo.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_71_a4', 'gk_ltc_71', 'Theo yêu cầu của Hội đồng thi, kiểm tra.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_71_a1' WHERE id = 'gk_ltc_71';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_72', 'gk-lt-chung', 'Theo quy định hiện hành, xưởng thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện thủy nội địa có diện tích tối thiểu là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_72_a1', 'gk_ltc_72', '40 m²') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_72_a2', 'gk_ltc_72', '50 m²') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_72_a3', 'gk_ltc_72', '30 m²') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_72_a4', 'gk_ltc_72', '60 m²') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_72_a4' WHERE id = 'gk_ltc_72';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_73', 'gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 3 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_73_a1', 'gk_ltc_73', '10 m ÷ 20 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_73_a2', 'gk_ltc_73', '20 m ÷ 30 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_73_a3', 'gk_ltc_73', '5 m ÷ 10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_73_a4', 'gk_ltc_73', '≤ 10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_73_a1' WHERE id = 'gk_ltc_73';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_74', 'gk-lt-chung', 'Khu vực dạy thực hành lái tại cơ sở đào tạo thuyền viên, người lái phương tiện phải có cầu tàu để dạy nghề thuyền trưởng từ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_74_a1', 'gk_ltc_74', 'Hạng nhì trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_74_a2', 'gk_ltc_74', 'Hạng ba trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_74_a3', 'gk_ltc_74', 'Hạng tư trở lên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_74_a4', 'gk_ltc_74', 'Hạng nhất.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_74_a1' WHERE id = 'gk_ltc_74';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_75', 'gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phươngtiện loại 2 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_75_a1', 'gk_ltc_75', '≥2KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_75_a2', 'gk_ltc_75', '≤2KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_75_a3', 'gk_ltc_75', '≥1KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_75_a4', 'gk_ltc_75', '≤1KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_75_a1' WHERE id = 'gk_ltc_75';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_76', 'gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 2 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_76_a1', 'gk_ltc_76', '10 m ÷ 20 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_76_a2', 'gk_ltc_76', '≤10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_76_a3', 'gk_ltc_76', '20 m ÷ 30 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_76_a4', 'gk_ltc_76', '5 m ÷ 10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_76_a3' WHERE id = 'gk_ltc_76';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_77', 'gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 1 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_77_a1', 'gk_ltc_77', '≥1KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_77_a2', 'gk_ltc_77', '≤2KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_77_a3', 'gk_ltc_77', '≤1KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_77_a4', 'gk_ltc_77', '≥2KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_77_a4' WHERE id = 'gk_ltc_77';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_78', 'gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 1 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_78_a1', 'gk_ltc_78', '5 m ÷ 10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_78_a2', 'gk_ltc_78', '10 m ÷ 20 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_78_a3', 'gk_ltc_78', '≤10 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_78_a4', 'gk_ltc_78', '20 m ÷ 30 m') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_78_a4' WHERE id = 'gk_ltc_78';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_79', 'gk-lt-chung', 'Màn hình theo dõi của hệ thống camera giám sát') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_79_a1', 'gk_ltc_79', 'Chỉ có Chủ tịch Hội đồng thi, kiểm tra được xem.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_79_a2', 'gk_ltc_79', 'Là bí mật, chỉ được xem khi nghi ngờ có vi phạm trong thi, kiểm tra.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_79_a3', 'gk_ltc_79', 'Chỉ có Cục Đường thủy nội địa Việt Nam được xem.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_79_a4', 'gk_ltc_79', 'Là công khai.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_79_a4' WHERE id = 'gk_ltc_79';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_80', 'gk-lt-chung', 'Theo quy định hiện hành, phòng học chuyên môn tại cơ sở đào tạo thuyền viên, người lái phương tiện thủy nội địa có diện tích tối thiểu là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_80_a1', 'gk_ltc_80', '38 m²') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_80_a2', 'gk_ltc_80', '58 m²') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_80_a3', 'gk_ltc_80', '48 m2') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_80_a4', 'gk_ltc_80', '28 m²') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_80_a3' WHERE id = 'gk_ltc_80';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_81', 'gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 3 là:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_81_a1', 'gk_ltc_81', '≥2KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_81_a2', 'gk_ltc_81', '≤2KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_81_a3', 'gk_ltc_81', '≤1KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_81_a4', 'gk_ltc_81', '≥1KM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_81_a1' WHERE id = 'gk_ltc_81';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_82', 'gk-lt-chung', 'Phương tiện thi thực hành có phải lắp đặt thiết bị giám sát hay không ?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_82_a1', 'gk_ltc_82', 'Phụ thuộc vào từng loại phương tiện theo quy định của đăng kiểm.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_82_a2', 'gk_ltc_82', 'Khi nào có yêu cầu thì lắp đặt.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_82_a3', 'gk_ltc_82', 'Không cần lắp đặt.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_82_a4', 'gk_ltc_82', 'Phương tiện thi phải được lắp đặt thiết bị giám sát.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_82_a4' WHERE id = 'gk_ltc_82';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_83', 'gk-lt-chung', 'Trường hợp nào thì học viên được phép bù giờ?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_83_a1', 'gk_ltc_83', 'Học viên không điều khiển được chuột vi tính.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_83_a2', 'gk_ltc_83', 'Học viên vào thi trễ.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_83_a3', 'gk_ltc_83', 'Máy tính học viên đang thi bị lỗi phải đổi máy.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_83_a4', 'gk_ltc_83', 'Học viên không biết sử dụng máy tính.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_83_a3' WHERE id = 'gk_ltc_83';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_84', 'gk-lt-chung', 'Trong ngày thi trực tuyến, sau khi Hội đồng thi login và kích hoạt tài khoản đăng nhập, thí sinh thực hiện hành động nào theo quy trình?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_84_a1', 'gk_ltc_84', 'Nhận đề thi từ cán bộ coi thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_84_a2', 'gk_ltc_84', 'Đăng nhập theo SBD và mật khẩu Giám thị cung cấp') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_84_a3', 'gk_ltc_84', 'Ký tên vào phiếu làm bài') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_84_a4', 'gk_ltc_84', 'Nộp bài') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_84_a2' WHERE id = 'gk_ltc_84';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_85', 'gk-lt-chung', 'Tên khóa học Quy ước đặt tên khóa học "CCCM NGHIỆP VỤ LÁI PHƯƠNG TIỆN K03/2025-DT2" được sử dụng cho khóa nào trong ví dụ được cung cấp?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_85_a1', 'gk_ltc_85', 'Khóa Máy trưởng hạng nhất khóa 19 năm 2025 tại Trường CĐ Hàng hải & Đường thủy II') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_85_a2', 'gk_ltc_85', 'Khóa chứng chỉ nghiệp vụ lái phương tiện khóa 03 năm 2025 tại trường Cao đẳng Hàng hải & Đường thủy II') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_85_a3', 'gk_ltc_85', 'Khóa GCNKNCM Thuyền trưởng hạng nhất khóa 19 năm 2025 của Cục ĐTNĐ VN') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_85_a4', 'gk_ltc_85', 'Lớp chứng chỉ Thợ máy khóa 1 năm 2025 tại Trường CĐ Hàng hải & Đường thủy II') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_85_a2' WHERE id = 'gk_ltc_85';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_86', 'gk-lt-chung', 'Để tránh tình trạng trùng số báo danh giữa các Kỳ thi Hội đồng thi, kiểm tra cần đánh SBD của học viên trên phần mềm theo nguyên tắc.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_86_a1', 'gk_ltc_86', 'CSDT. Hạng') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_86_a2', 'gk_ltc_86', 'Hạng.CSDT.STT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_86_a3', 'gk_ltc_86', 'A.CSDT. Hạng') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_86_a4', 'gk_ltc_86', 'Hạng.STT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_86_a2' WHERE id = 'gk_ltc_86';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_87', 'gk-lt-chung', 'Giám thị sử dụng nút “Tạm dừng” khi nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_87_a1', 'gk_ltc_87', 'Khi cần nhắc nhở học viên trong ca thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_87_a2', 'gk_ltc_87', 'Khi phát hiện học viên đăng nhập không đúng số báo danh.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_87_a3', 'gk_ltc_87', 'Khi máy tính học viên bị lỗi chờ xử lý.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_87_a4', 'gk_ltc_87', 'Tất cả các ý trên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_87_a4' WHERE id = 'gk_ltc_87';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_88', 'gk-lt-chung', 'Sau khi thí sinh hoàn thành và nộp bài thi, Hội đồng thi có nhiệm vụ gì liên quan đến kết quả môn thi không trực tuyến?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_88_a1', 'gk_ltc_88', 'In văn bằng chứng chỉ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_88_a2', 'gk_ltc_88', 'Nhập điểm thi cho môn Lý thuyết chuyên môn và Thực hành') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_88_a3', 'gk_ltc_88', 'Kích hoạt tài khoản đăng nhập cho thí sinh') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_88_a4', 'gk_ltc_88', 'Tổng hợp kết quả thi, xét kết quả thi, lập báo cáo số 3') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_88_a2' WHERE id = 'gk_ltc_88';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_89', 'gk-lt-chung', 'Tên gọi kỳ thi và mô tả của kỳ thi được thống nhất đặt theo quy ước nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_89_a1', 'gk_ltc_89', 'Đặt tên riêng biệt cho từng kỳ thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_89_a2', 'gk_ltc_89', 'Đặt như tên khóa học và mã khoá ở trên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_89_a3', 'gk_ltc_89', 'Đặt theo tên của cơ sở đào tạo') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_89_a4', 'gk_ltc_89', 'Đặt tên theo số thứ tự của kỳ thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_89_a2' WHERE id = 'gk_ltc_89';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_90', 'gk-lt-chung', 'Theo "Quy trình Quản lý thi tuyển trực tuyến", trước ngày thi thực tế, Hội đồng thi có nhiệm vụ chính nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_90_a1', 'gk_ltc_90', 'Thí sinh ngồi vào máy tính, đăng nhập theo thẻ dự thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_90_a2', 'gk_ltc_90', 'Hội đồng thi login, kích hoạt tài khoản đăng nhập') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_90_a3', 'gk_ltc_90', 'Kiểm tra loại trừ hồ sơ không hợp lệ, lập danh sách dự thi, đánh số báo danh') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_90_a4', 'gk_ltc_90', 'Cán bộ coi thi phát đề thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_90_a3' WHERE id = 'gk_ltc_90';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_91', 'gk-lt-chung', 'Quy trình thao tác trên phần mềm của cơ sở đào tạo trước khi tổ chức đào tạo?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_91_a1', 'gk_ltc_91', 'Tạo năm học, khóa, lớp, nhập danh sách học viên, khóa báo cáo 1, xét điều kiện dự học.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_91_a2', 'gk_ltc_91', 'Tạo khóa, lớp, nhập danh sách học viên, xét điều kiện dự học, khóa báo cáo 1') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_91_a3', 'gk_ltc_91', '') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_91_a4', 'gk_ltc_91', 'Nhập danh sách học viên, khóa báo cáo 1, tạo lớp, khóa, năm học.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_91_a2' WHERE id = 'gk_ltc_91';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_92', 'gk-lt-chung', 'Trên máy học viên hiển thị thông báo “Thông tin đăng nhập chưa chính xác!” là do?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_92_a1', 'gk_ltc_92', 'Nhập sai “Tên đăng nhập” hoặc “Mật khẩu” của học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_92_a2', 'gk_ltc_92', 'Nhập sai “Tên đăng nhập” của học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_92_a3', 'gk_ltc_92', 'Nhập sai “Mật khẩu” của học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_92_a4', 'gk_ltc_92', 'Sai thông tin cá nhân của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_92_a1' WHERE id = 'gk_ltc_92';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_93', 'gk-lt-chung', 'Mã khóa học Theo quy tắc đặt tên trên Phần mềm Quản lý đào tạo thuyền viên, người lái phương tiện thủy nội địa, mã khóa học được quy ước gồm các thành phần nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_93_a1', 'gk_ltc_93', 'Tên hạng viết tắt. Khóa/năm-CSĐT.SỐ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_93_a2', 'gk_ltc_93', 'Loại hạng Nghề khóa/năm-CSĐT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_93_a3', 'gk_ltc_93', 'Khóa/năm-CSĐT.Hạng') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_93_a4', 'gk_ltc_93', 'Tên hạng khóa/năm-CSĐT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_93_a3' WHERE id = 'gk_ltc_93';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_94', 'gk-lt-chung', 'Trường hợp thấy trang thái “Đã tạo” trên máy giám thị mà in danh sách đăng nhập không có mật khẩu giám thị phải xử lý như thế nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_94_a1', 'gk_ltc_94', 'Bấm nút “Tìm kiếm” để lọc lại danh sách và thao tác in lại danh sách đăng nhập.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_94_a2', 'gk_ltc_94', 'Bấm nút “Xóa” để lọc lại danh sách và thao tác in lại danh sách đăng nhập.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_94_a3', 'gk_ltc_94', 'Bấm nút “Tìm kiếm” hiển thị mật khẩu.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_94_a4', 'gk_ltc_94', 'Bấm nút “Đóng” để đóng lại danh sách và thao tác in lại danh sách đăng nhập.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_94_a1' WHERE id = 'gk_ltc_94';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_95', 'gk-lt-chung', 'Trình tự thao tác trên phần mềm để Hội đồng tổ chức một kỳ thi, kiểm tra sau khi đã “Kiểm tra hồ sơ loại trừ”.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_95_a1', 'gk_ltc_95', 'Quản lý đào tạo, Tổ chức thi, Thêm, Chọn thông tin, Chuột trái Thêm phòng ở ô “Ca thi", Chuyển học viên vào ca thi và bấm cập nhật') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_95_a2', 'gk_ltc_95', 'Tổ chức thi, Quản lý đào tạo, Thêm, Chuột phải Thêm phòng ở ô “Ca thi”, Chọn thông tin, Chuyển học viên vào ca thi và bấm cập nhật') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_95_a3', 'gk_ltc_95', 'Quản lý đào tạo, Tổ chức thi, Thêm, Chuột trái Thêm phòng ở ô “Ca thi”, Chọn thông tin, Chuyển học viên vào ca thi và bấm cập nhật') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_95_a4', 'gk_ltc_95', 'Quản lý đào tạo, Tổ chức thi, Thêm, Chọn thông tin, Chuột phải Thêm phòng ở ô “Ca thi”, Chuyển học viên vào ca thi và bấm cập nhật') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_95_a4' WHERE id = 'gk_ltc_95';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_96', 'gk-lt-chung', 'Nút “Cho thi tiếp” có tác dụng gì?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_96_a1', 'gk_ltc_96', 'Cho học viên thi tiếp khi tạm dừng.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_96_a2', 'gk_ltc_96', 'Cho học viên thi tiếp khi buộc thu bài.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_96_a3', 'gk_ltc_96', 'Cho học viên thi tiếp khi đã hết thời gian làm bài.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_96_a4', 'gk_ltc_96', 'Cho học viên thi tiếp khi thu bài.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_96_a1' WHERE id = 'gk_ltc_96';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_97', 'gk-lt-chung', 'Tên lớp học cho "Lớp chứng chỉ Thợ máy khóa 1 năm 2025 tại cơ sở đào tạo Trường CĐ Hàng hải & Đường thủy II" được đặt là gì theo quy ước?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_97_a1', 'gk_ltc_97', 'CCCM THỢ MÁY K01/2025-DT2') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_97_a2', 'gk_ltc_97', 'TM.K01/2025-DT2.001') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_97_a3', 'gk_ltc_97', 'THỢ MÁY THỦY NỘI ĐỊA K01/2025-DT2') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_97_a4', 'gk_ltc_97', 'K01/2025-DT2.TM') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_97_a3' WHERE id = 'gk_ltc_97';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_98', 'gk-lt-chung', 'Trạng thái “Đã tạo” trên Form Quản lý thi trực tuyến thể hiện điều gì?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_98_a1', 'gk_ltc_98', 'Học viên đã đăng nhập vào trang thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_98_a2', 'gk_ltc_98', 'Đã tạo thành công mã học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_98_a3', 'gk_ltc_98', 'Học viên đã hoàn thành phần thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_98_a4', 'gk_ltc_98', 'Đề thi đã được tạo.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_98_a4' WHERE id = 'gk_ltc_98';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_99', 'gk-lt-chung', 'Để tạo thêm tài khoản trong phần mềm ta thực hiện theo các bước nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_99_a1', 'gk_ltc_99', 'Hệ thống, Người dùng, Thêm, Nhập thông tin nhân sự, Chọn mã vai trò, Tích chọn kích hoạt và bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_99_a2', 'gk_ltc_99', 'Hệ thống, Người dùng, Thêm, Nhập thông tin nhân sự, nhập thông tin Tài khoản đăng nhập, Chọn mã vai trò, Tích chọn kích hoạt.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_99_a3', 'gk_ltc_99', 'Hệ thống, Người dùng, Thêm, Nhập thông tin nhân sự, nhập thông tin Tài khoản đăng nhập, Chọn mã vai trò, Tích chọn kích hoạt và bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_99_a4', 'gk_ltc_99', 'Hệ thống, Người dùng, Nhập thông tin nhân sự, nhập thông tin Tài khoản đăng nhập, Chọn mã vai trò, Tích chọn kích hoạt và bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_99_a3' WHERE id = 'gk_ltc_99';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_100', 'gk-lt-chung', 'Theo quy trình, cơ quan nào có thẩm quyền kiểm tra Báo cáo số 3, quyết định công nhận kết quả thi và in văn bằng chứng chỉ?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_100_a1', 'gk_ltc_100', 'Cơ sở đào tạo') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_100_a2', 'gk_ltc_100', 'Hội đồng thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_100_a3', 'gk_ltc_100', 'Cán bộ coi thi') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_100_a4', 'gk_ltc_100', 'Sở xây dựng') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_100_a4' WHERE id = 'gk_ltc_100';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_101', 'gk-lt-chung', 'Để chỉnh sửa báo cáo, biểu mẫu chúng ta cần thao tác như sau:') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_101_a1', 'gk_ltc_101', 'Chọn Edit, tùy chỉnh báo cáo như ý Mở báo cáo ở chế độ xem in rồi bấm Save') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_101_a2', 'gk_ltc_101', 'Mở báo cáo ở chế độ xem in, Chọn Edit, tùy chỉnh báo cáo như ý rồi bấm Save') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_101_a3', 'gk_ltc_101', 'Chọn Edit, tùy chỉnh báo cáo như ý rồi bấm Save') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_101_a4', 'gk_ltc_101', 'Mở báo cáo ở chế độ xem in, tùy chỉnh báo cáo như ý rồi bấm Save') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_101_a2' WHERE id = 'gk_ltc_101';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_102', 'gk-lt-chung', 'Check box (ô) “Tự động thu” có chức năng gì?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_102_a1', 'gk_ltc_102', 'Khi hết thời gian làm bài máy giám thị sẽ tự động thu bài của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_102_a2', 'gk_ltc_102', 'Hết thời gian làm bài hoặc khi học viên nộp bài, máy giám thị sẽ thu bài và in bài làm của học viên ra máy in.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_102_a3', 'gk_ltc_102', 'Không có chức năng gì cả.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_102_a4', 'gk_ltc_102', 'Khi học viên nộp bài, máy giám thị sẽ tự động thu bài của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_102_a2' WHERE id = 'gk_ltc_102';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_103', 'gk-lt-chung', 'Giám thị nhấn “Phát đề” khi nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_103_a1', 'gk_ltc_103', 'Khi đã cho hết học viên trong ca vào phòng thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_103_a2', 'gk_ltc_103', 'Khi có trạng thái “Đã đăng nhập” trên màn hình của máy giám thị.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_103_a3', 'gk_ltc_103', 'Khi học viên đã đăng nhập thành công vào ca thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_103_a4', 'gk_ltc_103', 'Khi có trạng thái “Đã tạo” trên màn hình của máy giám thị.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_103_a2' WHERE id = 'gk_ltc_103';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_104', 'gk-lt-chung', 'Các bước thao tác trên phần mềm của cơ sở đào tạo sau khi tổ chức đào tạo và trước khi tổ chức thi, kiểm tra?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_104_a1', 'gk_ltc_104', 'Tổng kết điểm, xét điều kiện dự thi, nhập điểm kết thúc các môn học, khóa báo cáo 2.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_104_a2', 'gk_ltc_104', 'Khóa báo cáo 2, nhập điểm kết thúc các môn học, tổng kết điểm, xét điều kiện dự thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_104_a3', 'gk_ltc_104', 'Nhập điểm kết thúc các môn học, tổng kết điểm, xét điều kiện dự thi, khóa báo cáo 2.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_104_a4', 'gk_ltc_104', 'Xét điều kiện dự thi, tổng kết điểm, nhập điểm kết thúc các môn học, khóa báo cáo 2.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_104_a3' WHERE id = 'gk_ltc_104';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_105', 'gk-lt-chung', 'Những thông tin nào sau đây trong báo cáo có thể chỉnh sửa?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_105_a1', 'gk_ltc_105', 'Tất cả thông tin trong báo cáo') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_105_a2', 'gk_ltc_105', 'Tất cả các trường dữ liệu Tiếng việt') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_105_a3', 'gk_ltc_105', 'Tất cả các trường dữ liệu Tiếng anh') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_105_a4', 'gk_ltc_105', 'Thông tin học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_105_a2' WHERE id = 'gk_ltc_105';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_106', 'gk-lt-chung', 'Mã lớp học được quy ước theo cách nào so với các mã khác?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_106_a1', 'gk_ltc_106', 'Giống mã số học viên') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_106_a2', 'gk_ltc_106', 'Tên hạng khóa/năm-CSĐT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_106_a3', 'gk_ltc_106', 'Giống mã khóa') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_106_a4', 'gk_ltc_106', 'Tên hạng viết tắt. Khóa/năm-CSĐT.SỐ') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_106_a3' WHERE id = 'gk_ltc_106';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_107', 'gk-lt-chung', 'Theo "Quy trình Quản lý thi tuyển trực tuyến", môn Lý thuyết tổng hợp được tổ chức thi dưới hình thức nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_107_a1', 'gk_ltc_107', 'Thi trắc nghiệm trực tuyến') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_107_a2', 'gk_ltc_107', 'Thi viết tự luận') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_107_a3', 'gk_ltc_107', 'Thi vấn đáp') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_107_a4', 'gk_ltc_107', 'Thi thực hành') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_107_a1' WHERE id = 'gk_ltc_107';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_108', 'gk-lt-chung', 'Trường hợp “Nhập HS học viên từ excel” bị lỗi là do?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_108_a1', 'gk_ltc_108', 'Các trường dữ liệu trong file excel sai kiểu số liệu') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_108_a2', 'gk_ltc_108', 'Máy tính chưa cài đặt phần mềm Excel của Microsoft.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_108_a3', 'gk_ltc_108', 'Chưa thực hiện thao tác tạo khóa, lớp.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_108_a4', 'gk_ltc_108', 'Tất cả các ý trên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_108_a4' WHERE id = 'gk_ltc_108';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_109', 'gk-lt-chung', 'Trường hợp không chọn “Check box” ô “ Tự động thu” khi xuất hiện trạng thái “Nộp bài” thì giám thi phải thao tác như thế nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_109_a1', 'gk_ltc_109', 'Thao tác chọn học viên có trạng thái “Nộp bài” rồi bấm “Buộc thu bài” và in bài làm của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_109_a2', 'gk_ltc_109', 'Bấm tổ hợp phím Ctr + A rồi bấm “Thu bài” và in bài làm của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_109_a3', 'gk_ltc_109', 'Thao tác chọn học viên có trạng thái “Nộp bài” rồi bấm “Thu bài” và in bài làm của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_109_a4', 'gk_ltc_109', 'Bấm tổ hợp phím Ctr + A chuột phải chọn rồi bấm “Thu bài” và in bài làm của học viên.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_109_a3' WHERE id = 'gk_ltc_109';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_110', 'gk-lt-chung', 'Để bù giờ cho học viên phải thao tác?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_110_a1', 'gk_ltc_110', 'Nhập số phút bù giờ ở cột bù giờ và bấm “Cập nhật”') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_110_a2', 'gk_ltc_110', 'Nhập số phút bù giờ ở cột bù giờ và bấm “Phát đề”') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_110_a3', 'gk_ltc_110', 'Nhập số phút bù giờ ở cột bù giờ và bấm “Cho thi tiếp”') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_110_a4', 'gk_ltc_110', 'Nhập số phút bù giờ ở cột bù giờ và bấm “Đóng”') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_110_a1' WHERE id = 'gk_ltc_110';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_111', 'gk-lt-chung', 'Mã số học viên của học viên đầu tiên "Lớp Thợ máy khóa 1 năm 2025 tại cơ sở đào tạo Trường CĐ Hàng hải & Đường Thủy II" được tạo theo định dạng nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_111_a1', 'gk_ltc_111', 'TM.K01/2025-DT2.001') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_111_a2', 'gk_ltc_111', 'K01/2025-DT2.TM.001') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_111_a3', 'gk_ltc_111', '001.TM.K01/2025-DT2') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_111_a4', 'gk_ltc_111', 'DT2.TM.K01/2025.001') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_111_a1' WHERE id = 'gk_ltc_111';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_112', 'gk-lt-chung', 'Trước khi khóa Báo cáo 3, Hội đồng thi kiểm tra cần thực hiện thao tác nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_112_a1', 'gk_ltc_112', 'Hệ thống, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_112_a2', 'gk_ltc_112', 'Báo cáo, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_112_a3', 'gk_ltc_112', 'Quản lý đào tạo, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_112_a4', 'gk_ltc_112', 'Quản lý học viên, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_112_a3' WHERE id = 'gk_ltc_112';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_113', 'gk-lt-chung', 'Trường hợp tích chọn ô “Tự động thu” mà máy giám thị không in bài thi của học viên thì phải làm thế nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_113_a1', 'gk_ltc_113', 'Thao tác chọn học viên chưa in bài thi bấm chuột phải chọn “Nạp lại”.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_113_a2', 'gk_ltc_113', 'Thao tác chọn học viên chưa in bài thi bấm “Buộc thu bài”') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_113_a3', 'gk_ltc_113', 'Thao tác chọn học viên chưa in bài thi bấm chuột phải chọn “Xuất đề thi và đáp án".') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_113_a4', 'gk_ltc_113', 'Thao tác chọn học viên chưa in bài thi bấm chuột phải In/Bài thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_113_a4' WHERE id = 'gk_ltc_113';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_114', 'gk-lt-chung', 'Để dễ quan sát các trạng thái của ca thi giám thị có thể thao tác như thế nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_114_a1', 'gk_ltc_114', 'Bấm vào tiêu đề “Số báo danh” của thí sinh để sắp xếp.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_114_a2', 'gk_ltc_114', 'Bấm vào tiêu đề “Tên” của thí sinh để sắp xếp.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_114_a3', 'gk_ltc_114', 'Bấm vào tiêu đề “Trang thái” của bài thi để sắp xếp') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_114_a4', 'gk_ltc_114', 'Bấm vào tiêu đề “Giờ bắt đầu” của bài thi để sắp xếp.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_114_a3' WHERE id = 'gk_ltc_114';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_115', 'gk-lt-chung', 'Hội đồng thi, kiểm tra thao tác như thế nào để lấy được điểm của bài thi trực tuyến vào Điểm thi theo kỳ?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_115_a1', 'gk_ltc_115', 'Trắc nghiệm, Chọn thông tin kỳ thi, Tổng hợp bài thi trực tuyến sau đó bấm cập nhật điểm') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_115_a2', 'gk_ltc_115', 'Quản lý đào tạo, Nhập điểm thi theo kỳ, Tổng hợp bài thi trực tuyến sau đó bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_115_a3', 'gk_ltc_115', 'Trắc nghiệm, Tổng hợp bài thi trực tuyến, Chọn thông tin kỳ thi sau đó bấm cập nhật điểm') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_115_a4', 'gk_ltc_115', 'Quản lý đào tạo, Nhập điểm thi theo kỳ, Nhập điểm của học viên sau đó bấm cập nhật.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_115_a3' WHERE id = 'gk_ltc_115';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_116', 'gk-lt-chung', 'Trường hợp nào phải bấm “Buộc thu bài” của học viên?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_116_a1', 'gk_ltc_116', 'Học viên vi phạm quy chế thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_116_a2', 'gk_ltc_116', 'Hết giờ mà lỗi mạng không thu bài.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_116_a3', 'gk_ltc_116', 'Học viên vi phạm quy chế thi hoặc hết giờ mà lỗi mạng không thu bài.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_116_a4', 'gk_ltc_116', 'Khi hết giờ thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_116_a3' WHERE id = 'gk_ltc_116';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_117', 'gk-lt-chung', 'Để in được danh sách học viên có Tên đăng nhập và mật khẩu của ca thi phải thao tác như thế nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_117_a1', 'gk_ltc_117', 'Nhấn chuột phải chọn In/Danh sách đăng nhập') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_117_a2', 'gk_ltc_117', 'Bấm tổ hợp phím Ctr + A vào danh sách học viên, nhấn chuột phải chọn In/Danh sách đăng nhập.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_117_a3', 'gk_ltc_117', 'Bấm tổ hợp phím Ctr + A vào danh sách học viên, nhấn chuột phải chọn “Xuất đề thi và đáp án”.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_117_a4', 'gk_ltc_117', 'Bấm tổ hợp phím Ctr + A vào danh sách học viên, nhấn chuột phải chọn In/Bài thi.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_117_a2' WHERE id = 'gk_ltc_117';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_118', 'gk-lt-chung', 'Ví dụ về Mã khóa học Mã khóa học cho "Khóa thuyền trưởng hạng nhất khóa 7 năm 2025 tại cơ sở đào tạo Trường CĐ Hàng hải và Đường thủy II" sẽ được định dạng như thế nào theo quy ước?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_118_a1', 'gk_ltc_118', 'K07/2025-DT2.T1') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_118_a2', 'gk_ltc_118', 'K07/2025') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_118_a3', 'gk_ltc_118', 'CCCM THUYỀN TRƯỞNG HẠNG NHẤT K07/2025-DT2') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_118_a4', 'gk_ltc_118', 'T1.K07/2025-DT2.001') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_118_a1' WHERE id = 'gk_ltc_118';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_119', 'gk-lt-chung', 'Không đăng ký được học viên thi lại ở các khóa trước vào khóa hiện tại là do?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_119_a1', 'gk_ltc_119', 'Chưa khóa báo cáo 1 của khóa hiện tại') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_119_a2', 'gk_ltc_119', 'Chưa xét kết quả thi và khóa báo cáo 3 của các khóa trước.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_119_a3', 'gk_ltc_119', '') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_119_a4', 'gk_ltc_119', 'Chưa xét kết quả thi của các khóa trước.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_119_a2' WHERE id = 'gk_ltc_119';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_120', 'gk-lt-chung', 'Tên khóa học 2 Nếu một Cơ sở đào tạo có các hạng LPT, TT thi chung khóa 01 năm 2025, tên khóa học 2 sẽ được đặt chung là gì?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_120_a1', 'gk_ltc_120', 'CCCM CHUNG K01/2025-CSĐT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_120_a2', 'gk_ltc_120', 'LPT.TT.K01/2025') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_120_a3', 'gk_ltc_120', 'K01/2025') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_120_a4', 'gk_ltc_120', 'K01/2025-LPT.TT') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_120_a3' WHERE id = 'gk_ltc_120';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_121', 'gk-lt-chung', 'Khi gặp sự cố về Hạ tầng thi (Máy tính, mạng) làm ảnh hưởng đến kết quả của học viên, để đảm bảo lợi ích của học viên Hội đồng thi, kiểm tra cần xử lý thế nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_121_a1', 'gk_ltc_121', 'Lập biên bản ghi nhận sự việc, cho học viên thi lại vào đợt sau.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_121_a2', 'gk_ltc_121', 'Lập biên bản ghi nhận sự việc, Hội đồng xử lý trực tiếp trên phần mềm theo biên bản.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_121_a3', 'gk_ltc_121', 'Lập biên bản ghi nhận sự việc, cán bộ coi thi, kiểm tra thao tác trên phần mềm theo biên bản.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_121_a4', 'gk_ltc_121', 'Lập biên bản ghi nhận sự việc, báo cho bộ phận Quản trị phần mềm xử lý như đề xuất của hội đồng trong biên bản.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_121_a4' WHERE id = 'gk_ltc_121';

INSERT INTO questions (id, subject_id, text) VALUES ('gk_ltc_122', 'gk-lt-chung', 'Trên máy học viên hiển thị thông báo "Học viên đã được đăng nhập trên máy tính khác” xử lý thế nào?') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_122_a1', 'gk_ltc_122', 'Chuột phải tích chọn đúng học viên đó và bấm nút “Tạm dừng”.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_122_a2', 'gk_ltc_122', 'Chuột phải tích chọn đúng học viên đó và bấm nút “Buộc thu bài”.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_122_a3', 'gk_ltc_122', 'Chuột phải tích chọn đúng học viên đó và bấm nút “Buộc login lại”.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
INSERT INTO answers (id, question_id, text) VALUES ('gk_ltc_122_a4', 'gk_ltc_122', 'Bấm tổ hợp phím Ctr + A vào danh sách học viên chuột phải tích chọn và bấm nút “Buộc login lại”.') ON CONFLICT (id) DO UPDATE SET text = EXCLUDED.text;
UPDATE questions SET correct_answer_id = 'gk_ltc_122_a3' WHERE id = 'gk_ltc_122';

