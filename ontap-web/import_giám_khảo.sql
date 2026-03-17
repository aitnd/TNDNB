-- FOUNDATIONAL SETUP
INSERT INTO licenses (id, name, display_order) VALUES ('giam-khao', 'Giám khảo', 100) ON CONFLICT (id) DO NOTHING;
INSERT INTO subjects (id, name, license_id, display_order) VALUES ('gk-lt-chung', 'Lý thuyết chung', 'giam-khao', 1) ON CONFLICT (id) DO NOTHING;

-- QUESTIONS AND ANSWERS
DO $$
DECLARE
    q_id INT;
    a1_id INT;
    a2_id INT;
    a3_id INT;
    a4_id INT;
BEGIN
    -- Question 1
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi. coi kiểm tra, chấm kiểm tra thì:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được Chi Cục Hàng hải và Đường thủy Phía Nam cấp thẻ giám khảo') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được Cục Hàng hải và Đường thủy Việt Nam cấp thẻ giám khảo.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được công bố trên cồng thông tin điện tử của Cục Hàng hải và Đường thủy Việt Nam.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được Sở GTVT địa phương cấp thẻ giám khảo.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 2
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là T.TH1') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng nhất;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng nhất;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng nhì;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng nhì;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 3
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người có bằng tốt nghiệp cao đẳng trở lên được đào tạo nghề máy tàu biển, có GCNKNCM máy trưởng tàu biển từ 750 kW trở lên, có thời gian đảm nhiệm theo chức danh máy trưởng tàu biển tương ứng đủ 06 tháng trở lên được chuyển đổi sang:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM máy trưởng hạng ba phương tiện thủy nội địa;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM máy trưởng hạng nhì phương tiện thủy nội địa;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thợ mày phương tiện thủy nội địa;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM máy trưởng hạng nhất phương tiện thủy nội địa;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 4
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM máy trưởng hạng ba phải bảo đảm điều kiện cụ thể sau:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 18 tuổi trở lên, có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 20 tuổi trở lên, có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy,') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 18 tuổi trở lên, có chứng chỉ thợ máy, có thời gian đảm nhiệm chức danh thợ máy đủ 12 tháng trở lên;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 20 tuổi trở lên, có chứng chỉ thợ máy, có thời gian đảm nhiệm chức danh thợ máy đủ 12 tháng trở lên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 5
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM thuyền trưởng hạng nhất phải bảo đảm điều kiện cụ thể sau:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có bằng tốt nghiệp trung cấp được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoàn thành thời gian tập sự theo chức danh thuyền trưởng hạng ba đủ 12 tháng trở lên;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có bằng tốt nghiệp trung học phổ thông hoặc tương đương trở lên, có GCNKNCM thuyền trưởng hạng nhì, có thời gian đảm nhiệm chức danh thuyền trưởng hạng nhì hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhất đủ 24 tháng trở lên;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có bằng tốt nghiệp trung cấp được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoàn thành thời gian tập sự theo chức danh thuyền trưởng hạng ba đủ 18 tháng trở lên.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 22 tuổi trở lên, có GCNKNCM thuyền trưởng hạng nhì, có thời gian đảm nhiệm chức danh thuyền trưởng hạng nhì hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhất đủ 24 tháng trở lên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 6
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ai có thẩm quyền xử lý vi phạm đối với thành viên Ban coi thi, chấm thi, coi kiểm tra, chấmkiểm tra:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bộ GTVT') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở đào tạo') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cục Hàng hải và Đường thủy Việt Nam') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chủ tịch Hội đồng thi, kiểm tra') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 7
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian thi môn lý thuyết tổng hợp (trắc nghiệm ) tối đa:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '90 phút') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '30 phút') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '60 phút') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '45 phút') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 8
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian thi môn thực hành thuyền trưởng hạng nhất tối đa:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '45 phút') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '60 phút') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '120 phút') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '90 phút') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 9
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám khảo giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 06 tháng khi vi phạm quy định nào dưới đây:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Để xảy ra xô xát, va chạm, tai nạn trong khi coi thi, chấm thi, coi kiểm tra, chấm kiểm tra do nguyên nhân chủ quan;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bao che cho những hành vi sai phạm, tiêu cực;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không kiểm tra kỹ bài thi, kiểm tra dẫn đến thiếu sót các nội dung liên quan bài thi, kiểm tra khi bàn giao bài thi, kiểm tra cho thư ký Hội đồng thi, kiểm tra.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Làm việc riêng, uống rượu, bia hoặc sử dụng các chất kích thích khác mà pháp luật cấm sử dụng trong khi tham gia công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 10
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển, đã tham gia giảng dạy hoặc làm việc trong lĩnh vực đường thủy nội địa từ 12 tháng trở lên.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ A tin học và Tốt nghiệp trung cấp trở lên.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung cấp trở lên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 11
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám khảo, giám thị hoạt động dưới sự điều hành của:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở đào tạo') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hội đồng thi') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chi cục Hàng hải và Đường thủy Việt Nam') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cục Hàng hải và Đường thủy Việt Nam') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 12
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra Môn lý thuyết chuyên môn là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển, đã tham gia giảng dạy hoặc làm việc trong lĩnh vực đường thủy nội địa từ 12 tháng trở lên.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ B tin học và Tốt nghiệp trung cấp trở lên.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung cấp trở lên') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung cấp trở lên thuộc một trong các chuyên ngành điều khiển tàu thủy hoặc điều khiển tàu biển, ngành máy tàu thủy hoặc máy tàu biển, đã tham gia giảng dạy hoặc làm việc trong lĩnh vực đường thủy nội địa từ 24 tháng trở lên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 13
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành thời gian lưu trữ bài thi, kiểm tra:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tối thiểu 02 năm;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tối thiểu 03 năm;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tối thiểu 01 năm;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tối thiểu 04 năm.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 14
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn thực hành thuyền trưởng hạng 2 (T2) là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên và có GCNKNCM thuyền trưởng hạng 1 (T1);') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 24 tháng trở lên;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 12 tháng trở lên;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên hoặc Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 12tháng trở lên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 15
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM máy trưởng hạng nhất phải bảo đảm điều kiện cụ thể sau:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có bằng tốt nghiệp trung cấp được đào tạo nghề máy tàu thủy hoặc máy tàu biển, hoàn thành thời gian tập sự theo chức danh máy trưởng hạng ba đủ 06 tháng trở lên;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 22 tuổi trở lên, có GCNKNCM máy trưởng hạng nhì, có thời gian đảm nhiệm chức danh máy trưởng hạng nhì hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhất đủ 18 tháng trở lên;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có bằng tốt nghiệp trung học phổ thông hoặc tương đương trở lên, có GCNKNCM máy trưởng hạng nhì, có thời gian đảm nhiệm chức danh máy trưởng hạng nhì hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhất đủ 18 tháng trở lên;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có bằng tốt nghiệp trung cấp được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoàn thành thời gian tập sự theo chức danh thuyền trưởng hạng ba đủ 12 tháng trở lên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 16
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM máy trưởng hạng nhì phải bảo đảm điều kiện cụ thể sau:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 20 tuổi trở lên, có GCNKNCM máy trưởng hạng ba, có thời gian đảm nhiệm chức danh máy trưởng hạng ba hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhì đủ 06 tháng trở lên;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có GCNKNCM máy trưởng hạng ba, có thời gian đảm nhiệm chức danh máy trưởng hạng ba hoặc đảm nhiệm chức danh máy phó của loại phương tiện được quy định cho chức danh máy trưởng hạng nhì đủ 12 tháng trở lên hoặc có chứng chỉ sơ cấp nghề máy trưởng hạng ba, có thời gian tập sự đủ 06 tháng trở lên;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy, hoàn thành thời gian tập sự đủ 12 tháng trở lên.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ sơ cấp nghề được đào tạo theo nghề máy tàu thủy hoặc máy tàu biển hoặc nghề thợ máy, hoàn thành thời gian tập sự đủ 06 tháng trở lên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 17
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là M.LTCM') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành máy phương tiện và môn lý thuyết tổng hợp;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành điều khiển phương tiện và môn lý thuyết tổng hợp;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 18
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM thuyền trưởng hạng nhì phải bảo đảm điều kiện cụ thể sau:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có GCNKNCM thuyền trưởng hạng ba, có thời gian đảm nhiệm chức danh thuyền trưởng hạng ba hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhì đủ 18 tháng trở lên hoặc có chứng chỉ sơ cấp nghề thuyền trưởng hạng ba, có thời gian tập sự đủ 12 tháng trở lên;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 20 tuổi trở lên, có GCNKNCM thuyền trưởng hạng ba, có thời gian đảm nhiệm chức danh thuyền trưởng hạng ba hoặc đảm nhiệm chức danh thuyền phó của loại phương tiện được quy định cho chức danh thuyền trưởng hạng nhì đủ 12 tháng trở lên;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoặc nghề thủy thủ, hoàn thành thời gian tập sự đủ 12 tháng trở lên.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoặc nghề thủy thủ, hoàn thành thời gian tập sự đủ 18 tháng trở lên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 19
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành cơ quan nào ra quyết định công nhận kết quả thi, cấp, cấp lại, chuyển đổi GCNKNCM thuyền trưởng, máy trưởng:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cục Hàng hải và Đường thủy Việt Nam;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở đào tạo.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bộ Xây dựng;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Sở Xây dựng;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 20
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám khảo, giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 03 tháng khi vi phạm quy định nào dưới đây:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không báo cáo Trưởng ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đề nghị Hội đồng thi, kiểm tra điều chỉnh kịp thời khi phát hiện sai sót trong đề thi, kiểm tra;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Trợ giúp thí sinh dưới mọi hình thức;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tự ý làm những công việc không được phân công;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các trường hợp trên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 21
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ngoài các điều kiện chung theo quy định tại, người dự thi để được cấp GCNKNCM thuyền trưởng hạng ba phải bảo đảm điều kiện cụ thể sau:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 18 tuổi trở lên, có chứng chỉ thủy thủ hoặc chứng chỉ lái phương tiện, có thời gian đảm nhiệm chức danh đủ 12 tháng trở lên hoặc có GCNKNCM thuyền trưởng hạng tư, có thời gian đảm nhiệm chức danh thủy thủ hoặc người lái phương tiện đủ 06 tháng trở lên;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển hoặc nghề thủy thủ, hoàn thành thời gian tập sự đủ 12 tháng trở lên;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có chứng chỉ sơ cấp nghề được đào tạo nghề điều khiển tàu thủy hoặc điều khiển tàu biển') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đủ 20 tuổi trở lên, có chứng chỉ thủy thủ hoặc chứng chỉ lái phương tiện, có thời gian đảm nhiệm chức danh đủ 06 tháng trở lên hoặc có GCNKNCM thuyền trưởng hạng tư, có thời gian đảm nhiệm chức danh thủy thủ hoặc người lái phương tiện đủ 06 tháng trở lên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 22
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người có văn bằng, chứng chỉ thuyền trưởng, máy trưởng tàu cá hạng II, có thời gian đảm nhiệm theo chức danh thuyền trưởng, máy trưởng tàu cá hạng II đủ 18 tháng trở lên được chuyển đổi sang GCNKNCM thuyền trưởng, máy trưởng loại nào:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng, máy trưởng hạng ba chỉ dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng, máy trưởng hạng nhì, chỉ dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng, máy trưởng hạng ba nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng với thuyền trưởng, máy trưởng hạng ba, dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng, máy trưởng hạng nhất nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng với thuyền trưởng, máy trưởng hạng ba, dự thi các môn thi tương ứng với thuyền trưởng, máy trưởng hạng ba và phải đạt yêu cầu theo quy định') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 23
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Quyền hạn của người giám sát kỳ thi, kiểm tra:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi phát hiện sai phạm phải lập biên bản;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đề nghị Hội đồng thi, kiểm tra xử lý kịp thời, đúng quy định;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Báo cáo Sở Xây dựng để xem xét, xử lý') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các ý trên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 24
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là T.LTCM') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành máy phương tiện và môn lý thuyết tổng hợp;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chỉ được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn ngành điều khiển phương tiện và môn lý thuyết tổng hợp;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 25
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian thi môn thực hành thuyền trưởng hạng ba tối đa:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '60 phút') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '45 phút') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '120 phút') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '90 phút') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 26
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành cơ quan nào ra Quyết định công nhận kết quả kiểm tra, cấp, cấp lại, chuyển đổi CCCM đặc biệt:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở đào tạo.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cục Hàng hải và Đường thủy Việt Nam;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Sở Xây dựng;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bộ Xây dựng;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 27
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám khảo, giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 03 tháng khi vi phạm quy định nào dưới đây:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Để xảy ra xô xát, va chạm, tai nạn trong khi coi thi, chấm thi, coi kiểm tra, chấm kiểm tra do nguyên nhân chủ quan;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không tập hợp kết quả chấm thi, kiểm tra và bàn giao cho thư ký Hội đồng thi, kiểm tra;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không kiểm tra việc chấp hành nội quy thi, kiểm tra; danh sách thí sinh dự thi, kiểm tra; điều kiện an toàn phòng thi, kiểm tra; điều kiện an toàn của phương tiện, thiết bị phục vụ kỳ thi, kiểm tra;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các trường hợp trên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 28
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tiêu chuẩn tham dự tập huấn nghiệp vụ để được thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn thực hành tuyền trưởng hạng 1 (T1) là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên và có GCNKNCM thuyền trưởng hạng 1 (T1);') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 24 tháng trở lên;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên, Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 24 thángtrở lên;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tốt nghiệp trung học phổ thông hoặc tương đương trở lên, Có GCNKNCM thuyền trưởng hạng 1 (T1) và có thời gian đảm nhiệm chức danh thuyền trưởng hạng 1 (T1) từ 12 thángtrở lên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 29
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là T.TH2') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng nhì;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng ba;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đến máy trưởng hạng ba;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành đến thuyền trưởng hạng nhì;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 30
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Những ai sau đây khi thực hiện công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra phải hoàn thành lớp tập huấn nghiệp vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đạt yêu cầu do Cục Hàng hải và Đường thủy Việt Nam tổ chức :') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thành viên ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thư ký đồng thi, kiểm tra') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các trường hợp trên') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hội đồng thi,kiểm tra') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 31
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ai có thẩm quyền đình chỉ thực hiện nhiệm vụ, coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đối với thành viên Ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cục Hàng hải và Đường thủy Việt Nam') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở đào tạo') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bộ GTVT') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chủ tịch Hội đồng thi, kiểm tra') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 32
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành trong thời hạn bao lâu, kể từ ngày khai giảng, cơ sở đào tạo báo cáo Sở Xây dựng Danh sách học viên đủ điều kiện dự học:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '01 (một) ngày làm việc;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '05 (năm) ngày làm việc;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '07 (bảy) ngày làm việc.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '03 (ba) ngày làm việc;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 33
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám khảo giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra trong thời hạn 06 tháng khi vi phạm một trong các quy định dưới đây:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Làm việc riêng, uống rượu, bia hoặc sử dụng các chất kích thích khác mà pháp luật cấm sử dụng trong khi tham gia công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không kiểm tra kỹ bài thi, kiểm tra dẫn đến thiếu sót các nội dung liên quan bài thi, kiểm tra khi bàn giao bài thi, kiểm tra cho thư ký Hội đồng thi, kiểm tra.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không tập hợp kết quả chấm thi, kiểm tra và bàn giao cho thư ký Hội đồng thi, kiểm tra;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bao che cho những hành vi sai phạm, tiêu cực;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 34
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Đối với môn thi lý thuyết tổng hợp (trắc nghiệm) mỗi đề có:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '30 câu hỏi') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '20 câu hỏi') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '60 câu hỏi') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '15 câu hỏi') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 35
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian thi môn thực hành thuyền trưởng hạng nhì tối đa:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '120 phút') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '45 phút') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '60 phút') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '90 phút') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 36
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành trong thời hạn bao lâu, trước khi tổ chức kiểm tra cấp CCCM, cơ sở đào tạo báo cáo bằng văn bản về Sở Xây dựng để giám sát các kỳ kiểm tra:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '07 (bảy) ngày làm việc;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '10 (mười) ngày làm việc.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '09 (chín) ngày làm việc;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 37
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành cơ quan nào ra quyết định công nhận kết quả kiểm tra, cấp, cấp lại, chuyển đổi chứng chỉ nghiệp vụ:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cục Hàng hải và Đường thủy Việt Nam;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Sở Xây dựng;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở đào tạo.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bộ Xây dựng;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 38
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám khảo giám thị bị hủy kết quả công nhận thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tra khi:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có biểu hiện tiêu cực làm sai lệch kết quả thi, kiểm tra;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bao che cho những hành vi sai phạm, tiêu cực;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hai lần vi phạm không thực hiện đúng nội dung, quy trình và thủ tục của kỳ thi, kiểm tra theo quy định hiện hành;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hai lần vi phạm trợ giúp thí sinh dưới mọi hình thức;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 39
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người có bằng tố nghiệp cao đẳng trở lên được đào tạo nghề điều khiển tàu biển, có GCNKNCM thuyền trưởng tàu biển từ 500 GT trở lên, có thời gian đảm nhiệm theo chức danh thuyền trưởng tàu biển tương ứng đủ 06 tháng trở lên được chuyển đổi sang:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng hạng nhất phương tiện thủy nội địa;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng hạng nhì phương tiện thủy nội địa;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng hạng tư phương tiện thủy nội địa;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'GCNKNCM thuyền trưởng hạng ba phương tiện thủy nội địa;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 40
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người có chứng chỉ thủy thủ, thợ máy tàu biển được chuyển đổi tương ứng sang:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ, chứng chỉ lái phương tiện, chứng chỉ thợ máy phương tiện thủy nội địa nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ, thợ máy phương tiện thủy nội địa nhưng phải hoàn thành chương trình bồi dưỡng nghề tương ứng;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ, thợ máy phương tiện thủy nội địa và được cấp chứng chỉ an toàn làm việc trên phương tiện đi ven biển;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ, chứng chỉ lái phương tiện, chứng chỉ thợ máy phương tiện thủy nội địa;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 41
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám khảo, giám thị không được thực hiện coi thi, chấm thi, coi kiểm tra, chấm kiểm tratrong thời hạn 03 tháng khi vi phạm quy định nào dưới đây:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có thái độ, hành vi ứng xử không đúng mực khi tham gia công tác coi thi, chấm thi, coi kiểm tra, chấm kiểm tra;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không báo cáo Trưởng ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra đề nghị Hội đồng thi, kiểm tra điều chỉnh kịp thời khi phát hiện sai sót trong đề thi, kiểm tra;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Trợ giúp thí sinh dưới mọi hình thức;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các trường hợp trên;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 42
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Nhiệm vụ của Ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Coi thi, chấm thi, coi kiểm tra, chấm kiểm tra theo đúng quy định; Tập hợp kết quả chấm thi, kiểm tra và bàn giao cho Thư ký Hội đồng thi, kiểm tra;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đề nghị Hội đồng thi, kiểm tra điều chỉnh kịp thời nếu phát hiện sai sót trong đề thi, kiểm tra;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tổ chức, bố trí, sắp xếp thành viên Ban coi thi, chấm thi, coi kiểm tra, chấm kiểm tra bảo đảm nguyên tắc mỗi môn thi, kiểm tra phải có tối thiểu 02 (hai) thành viên;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các ý trên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 43
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Người hoàn thành lớp tập huấn nghiệp vụ đạt yêu cầu để thực hiện nhiệm vụ coi thi, chấm thi, coi kiểm tra, chấm kiểm tra được công bố trên Cổng thông tin điện tử của Cục Đường thủy nội địa Việt Nam với Ngành, loại, hạng là LTTH') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết chuyên môn;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra thực hành;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra môn lý thuyết tổng hợp;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được coi thi, chấm thi, coi kiểm tra, chấm kiểm tra tất cả các loại hạng;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 44
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chứng chỉ nghiệp vụ, bao gồm:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ (TT); Chứng chỉ thợ máy (TM); Chứng chỉ lái phương tiện (LPT).') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ hạng nhất (TT1); Chứng chỉ thủy thủ hạng nhì (TT2; Chứng chỉ thợ máy hạng nhất (TM1); Chứng chỉ thợ máy hạng nhì (TM2); Chứng chỉ lái phương tiện hạng nhất (LPT1). Chứng chỉ lái phương tiện hạng nhì (LPT2).') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ (TT); Chứng chỉ thợ máy (TM); Chứng chỉ lái phương tiện hạng nhất (LPT1).') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chứng chỉ thủy thủ (TT); Chứng chỉ thợ máy (TM); Chứng chỉ lái phương tiện (LPT). Chứng chỉ an toàn cơ bản (ATCB)') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 45
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Đối với môn thi lý thuyết tổng hợp (trắc nghiệm) làm đúng bao nhiêu câu trở lên thì đạt yêucầu:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '15 câu hỏi') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '27 câu hỏi') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '20 câu hỏi') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '25 câu hỏi') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 46
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Cơ sở đào tạo bị thu hồi Giấy chứng nhận trong các trường hợp sau :') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 12 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 12 tháng và theo các quy định khác có liên quan của pháp luật.;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 18 tháng và theo các quy định khác có liên quan của pháp luật;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không có trường hợp nào cả') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 47
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 3:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 48
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 4:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 49
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Cơ sở đào tạo bị thu hồi Giấy chứng nhận trong các trường hợp sau :') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 12 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 18 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không có trường hợp nào cả') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 18 tháng và theo các quy định khác có liên quan của pháp luật;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 50
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Cơ sở kinh doanh dịch vụ đào tạo thuyền viên, người lái phương tiện thủy nội địa được chiathành mấy loại:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '2 loại;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '4 loại;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '5 loại;') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '3 loại;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 51
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 1:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 52
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giáo viên dạy thực hành thuyền trưởng hạng ba phải:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng nào cũng được') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có giấy chứng nhận khả năng chuyên môn máytrưởng hạng nhì trở lên.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng ba trở lên') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Có giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng nhì trở lên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 53
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Cơ sở đào tạo bị thu hồi Giấy chứng nhận trong các trường hợp sau :') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi đã hết thời hạn bị đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa mà không khắc phục được các vi phạm là nguyên nhân dẫn đến việc bị đình chỉ;') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đã bị xử phạt vi phạm hành chính đình chỉ hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa 02 lần trở lên trong 18 tháng và theo các quy định khác có liên quan của pháp luật;') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không có trường hợp nào cả') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không tổ chức hoạt động đào tạo thuyền viên, người lái phương tiện thủy nội địa trong thời gian 12 tháng liên tục hoặc không triển khai hoạt động sau thời hạn 18 tháng, kể từ ngày được cấp Giấy chứng nhận;') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 54
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Sở Xây dựng có trách nhiệm tổ chức cấp, cấp lại, thu hồi Giấy chứng nhận cơ sở đủ điều kiện kinh doanh dịch vụ đào tạo thuyền viên, người lái phương tiện thủy nội địa đối với:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 4 trong phạm vi địa phương') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 3 trong phạm vi địa phương') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 2 trong phạm vi địa phương') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 1 trong phạm vi địa phương') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 55
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ủy ban nhân dân cấp tỉnh có trách nhiệm tổ chức cấp, cấp lại, thu hồi Giấy chứng nhận cơ sở đủ điều kiện kinh doanh dịch vụ đào tạo thuyền viên, người lái phương tiện thủy nội địa đối với:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 1 trong phạm vi địa bàn quản lý') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 2 trở lên trong phạm vi địa bàn quản lý') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 3 trở lên trong phạm vi địa bàn quản lý') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở loại 4 trở lên trong phạm vi địa bàn quản lý') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 56
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành, cơ sở đào tạo loại 2:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng ba trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn thuyền trưởng hạng tư, chứng chỉ nghiệp vụ.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp giấy chứng nhận khả năng chuyên môn từ hạng nhì trở xuống, chứng chỉ chuyên môn.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Được phép đào tạo, bổ túc, bồi dưỡng để cấp các loại giấy chứng nhận khả năng chuyên môn, chứng chỉ chuyên môn theo quy định của Luật giao thông đường thủy nội địa.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 57
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian thực học thực hành nghề tối thiểu chiếm bao nhiêu phần trăm tổng thời gian khóa học trong chương trình đào tạo thường xuyên:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '50%') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '60%') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '80%') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '70%') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 58
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành về đào tạo thường xuyên, số lượng học viên tối đa đối với lớp học kiến thức nghề là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '25 học viên') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '40 học viên') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '35 học viên') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '30 học viên') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 59
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Học viên không đạt yêu cầu khi kiểm tra kết thúc mô - đun, môn học trong đào tạo thường xuyên, thì được kiểm tra lại tối đa là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không được kiểm tra lại') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '03 lần') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '02 lần') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '01 lần') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 60
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian học mỗi buổi tối đa là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '6 giờ') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '5 giờ') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '4 giờ') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '3 giờ') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 61
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Kiểm tra đầu khóa học đối với học viên trong đào tạo thường xuyên để:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Xét tuyển đầu vào') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Lấy điểm điều kiện dự thi cuối khóa') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cả a và b') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chuẩn bị nội dung, phương pháp giảng dạy phù hợp') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 62
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Nội dung, hình thức và điều kiện kiểm tra khi kết thúc mô - đun, môn học trong đào tạo thường xuyên:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Do người đứng đầu cơ sở đào tạo quyết định') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Do giáo viên trực tiếp giảng dạy quyết định') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Do người phụ trách đào tạo của cơ sở đào tạo quyết định') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cả b và c') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 63
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian đào tạo đối với các chương trình đào tạo thường xuyên là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thời gian thực học kiến thức nghề, kỹ năng mềm') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thời gian thực học thực hành nghề') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thời gian kiểm tra trước, trong quá trình đào tạo, kiểm tra kết thúc khóa học') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cả ba ý trên') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 64
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Nội dung, phương pháp kiểm tra đầu khóa học đối với học viên trong đào tạo thường xuyên:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Do giáo viên trực tiếp giảng dạy lựa chọn, quyết định') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Do người đứng đầu cơ sở đào tạo lựa chọn, quyết định') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Do người phụ trách đào tạo của cơ sở đào tạo lựa chọn, quyết định') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cả b và c') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 65
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành về đào tạo thường xuyên, số lượng học viên tối đa đối với lớp học thực hành nghề là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '28 học viên') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '18 học viên') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '25 học viên') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '15 học viên') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 66
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Kết quả kiểm tra khi kết thúc mô - đun, môn học trong đào tạo thường xuyên được đánh giá theo:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Một trong hai mức: Đạt yêu cầu và Không đạt yêu cầu') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thang điểm 10') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thang điểm 100') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cả ba đáp án trên') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 67
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành về đào tạo thường xuyên, số lượng học viên tối đa đối với lớp học tích hợp là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '25 học viên') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '28 học viên') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '18 học viên') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '15 học viên') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 68
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Thời gian học trong một ngày tối đa là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '7 giờ') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '5 giờ') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '8 giờ') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '6 giờ') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 69
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 4 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '10 m ÷ 20 m') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '20 m ÷ 30 m') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '5 m ÷ 10 m') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤10 m') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 70
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 4 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤2 KM') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤1 KM') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥2 KM') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥1 KM') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 71
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Việc lắp đặt camera giám sát trong phòng thi, phòng kiểm tra là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bắt buộc theo quy định.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Theo yêu cầu của học viên.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Theo điều kiện của cơ sở đào tạo.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Theo yêu cầu của Hội đồng thi, kiểm tra.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 72
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành, xưởng thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện thủy nội địa có diện tích tối thiểu là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '40 m²') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '50 m²') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '30 m²') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '60 m²') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 73
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 3 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '10 m ÷ 20 m') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '20 m ÷ 30 m') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '5 m ÷ 10 m') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤ 10 m') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 74
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Khu vực dạy thực hành lái tại cơ sở đào tạo thuyền viên, người lái phương tiện phải có cầu tàu để dạy nghề thuyền trưởng từ') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hạng nhì trở lên.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hạng ba trở lên.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hạng tư trở lên.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hạng nhất.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 75
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phươngtiện loại 2 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥2KM') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤2KM') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥1KM') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤1KM') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 76
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 2 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '10 m ÷ 20 m') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤10 m') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '20 m ÷ 30 m') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '5 m ÷ 10 m') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 77
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 1 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥1KM') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤2KM') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤1KM') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥2KM') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 78
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài cầu, bến tàu để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 1 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '5 m ÷ 10 m') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '10 m ÷ 20 m') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤10 m') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '20 m ÷ 30 m') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 79
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Màn hình theo dõi của hệ thống camera giám sát') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chỉ có Chủ tịch Hội đồng thi, kiểm tra được xem.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Là bí mật, chỉ được xem khi nghi ngờ có vi phạm trong thi, kiểm tra.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chỉ có Cục Đường thủy nội địa Việt Nam được xem.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Là công khai.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 80
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy định hiện hành, phòng học chuyên môn tại cơ sở đào tạo thuyền viên, người lái phương tiện thủy nội địa có diện tích tối thiểu là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '38 m²') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '58 m²') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '48 m2') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '28 m²') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 81
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Chiều dài vùng nước để dạy thực hành tại cơ sở đào tạo thuyền viên, người lái phương tiện loại 3 là:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥2KM') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤2KM') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≤1KM') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '≥1KM') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 82
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Phương tiện thi thực hành có phải lắp đặt thiết bị giám sát hay không ?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Phụ thuộc vào từng loại phương tiện theo quy định của đăng kiểm.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi nào có yêu cầu thì lắp đặt.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không cần lắp đặt.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Phương tiện thi phải được lắp đặt thiết bị giám sát.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 83
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trường hợp nào thì học viên được phép bù giờ?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Học viên không điều khiển được chuột vi tính.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Học viên vào thi trễ.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Máy tính học viên đang thi bị lỗi phải đổi máy.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Học viên không biết sử dụng máy tính.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 84
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trong ngày thi trực tuyến, sau khi Hội đồng thi login và kích hoạt tài khoản đăng nhập, thí sinh thực hiện hành động nào theo quy trình?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhận đề thi từ cán bộ coi thi') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đăng nhập theo SBD và mật khẩu Giám thị cung cấp') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Ký tên vào phiếu làm bài') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nộp bài') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 85
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tên khóa học Quy ước đặt tên khóa học "CCCM NGHIỆP VỤ LÁI PHƯƠNG TIỆN K03/2025-DT2" được sử dụng cho khóa nào trong ví dụ được cung cấp?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khóa Máy trưởng hạng nhất khóa 19 năm 2025 tại Trường CĐ Hàng hải & Đường thủy II') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khóa chứng chỉ nghiệp vụ lái phương tiện khóa 03 năm 2025 tại trường Cao đẳng Hàng hải & Đường thủy II') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khóa GCNKNCM Thuyền trưởng hạng nhất khóa 19 năm 2025 của Cục ĐTNĐ VN') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Lớp chứng chỉ Thợ máy khóa 1 năm 2025 tại Trường CĐ Hàng hải & Đường thủy II') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 86
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Để tránh tình trạng trùng số báo danh giữa các Kỳ thi Hội đồng thi, kiểm tra cần đánh SBD của học viên trên phần mềm theo nguyên tắc.') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'CSDT. Hạng') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hạng.CSDT.STT') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'A.CSDT. Hạng') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hạng.STT') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 87
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám thị sử dụng nút “Tạm dừng” khi nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi cần nhắc nhở học viên trong ca thi.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi phát hiện học viên đăng nhập không đúng số báo danh.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi máy tính học viên bị lỗi chờ xử lý.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các ý trên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 88
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Sau khi thí sinh hoàn thành và nộp bài thi, Hội đồng thi có nhiệm vụ gì liên quan đến kết quả môn thi không trực tuyến?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'In văn bằng chứng chỉ') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập điểm thi cho môn Lý thuyết chuyên môn và Thực hành') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Kích hoạt tài khoản đăng nhập cho thí sinh') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tổng hợp kết quả thi, xét kết quả thi, lập báo cáo số 3') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 89
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tên gọi kỳ thi và mô tả của kỳ thi được thống nhất đặt theo quy ước nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đặt tên riêng biệt cho từng kỳ thi') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đặt như tên khóa học và mã khoá ở trên') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đặt theo tên của cơ sở đào tạo') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đặt tên theo số thứ tự của kỳ thi') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 90
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo "Quy trình Quản lý thi tuyển trực tuyến", trước ngày thi thực tế, Hội đồng thi có nhiệm vụ chính nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thí sinh ngồi vào máy tính, đăng nhập theo thẻ dự thi') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hội đồng thi login, kích hoạt tài khoản đăng nhập') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Kiểm tra loại trừ hồ sơ không hợp lệ, lập danh sách dự thi, đánh số báo danh') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cán bộ coi thi phát đề thi') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 91
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Quy trình thao tác trên phần mềm của cơ sở đào tạo trước khi tổ chức đào tạo?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tạo năm học, khóa, lớp, nhập danh sách học viên, khóa báo cáo 1, xét điều kiện dự học.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tạo khóa, lớp, nhập danh sách học viên, xét điều kiện dự học, khóa báo cáo 1') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập danh sách học viên, khóa báo cáo 1, tạo lớp, khóa, năm học.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 92
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trên máy học viên hiển thị thông báo “Thông tin đăng nhập chưa chính xác!” là do?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập sai “Tên đăng nhập” hoặc “Mật khẩu” của học viên') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập sai “Tên đăng nhập” của học viên') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập sai “Mật khẩu” của học viên') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Sai thông tin cá nhân của học viên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 93
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Mã khóa học Theo quy tắc đặt tên trên Phần mềm Quản lý đào tạo thuyền viên, người lái phương tiện thủy nội địa, mã khóa học được quy ước gồm các thành phần nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tên hạng viết tắt. Khóa/năm-CSĐT.SỐ') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Loại hạng Nghề khóa/năm-CSĐT') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khóa/năm-CSĐT.Hạng') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tên hạng khóa/năm-CSĐT') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 94
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trường hợp thấy trang thái “Đã tạo” trên máy giám thị mà in danh sách đăng nhập không có mật khẩu giám thị phải xử lý như thế nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm nút “Tìm kiếm” để lọc lại danh sách và thao tác in lại danh sách đăng nhập.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm nút “Xóa” để lọc lại danh sách và thao tác in lại danh sách đăng nhập.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm nút “Tìm kiếm” hiển thị mật khẩu.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm nút “Đóng” để đóng lại danh sách và thao tác in lại danh sách đăng nhập.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 95
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trình tự thao tác trên phần mềm để Hội đồng tổ chức một kỳ thi, kiểm tra sau khi đã “Kiểm tra hồ sơ loại trừ”.') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Quản lý đào tạo, Tổ chức thi, Thêm, Chọn thông tin, Chuột trái Thêm phòng ở ô “Ca thi", Chuyển học viên vào ca thi và bấm cập nhật') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tổ chức thi, Quản lý đào tạo, Thêm, Chuột phải Thêm phòng ở ô “Ca thi”, Chọn thông tin, Chuyển học viên vào ca thi và bấm cập nhật') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Quản lý đào tạo, Tổ chức thi, Thêm, Chuột trái Thêm phòng ở ô “Ca thi”, Chọn thông tin, Chuyển học viên vào ca thi và bấm cập nhật') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Quản lý đào tạo, Tổ chức thi, Thêm, Chọn thông tin, Chuột phải Thêm phòng ở ô “Ca thi”, Chuyển học viên vào ca thi và bấm cập nhật') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 96
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Nút “Cho thi tiếp” có tác dụng gì?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cho học viên thi tiếp khi tạm dừng.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cho học viên thi tiếp khi buộc thu bài.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cho học viên thi tiếp khi đã hết thời gian làm bài.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cho học viên thi tiếp khi thu bài.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 97
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tên lớp học cho "Lớp chứng chỉ Thợ máy khóa 1 năm 2025 tại cơ sở đào tạo Trường CĐ Hàng hải & Đường thủy II" được đặt là gì theo quy ước?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'CCCM THỢ MÁY K01/2025-DT2') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'TM.K01/2025-DT2.001') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'THỢ MÁY THỦY NỘI ĐỊA K01/2025-DT2') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'K01/2025-DT2.TM') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 98
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trạng thái “Đã tạo” trên Form Quản lý thi trực tuyến thể hiện điều gì?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Học viên đã đăng nhập vào trang thi.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đã tạo thành công mã học viên.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Học viên đã hoàn thành phần thi.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Đề thi đã được tạo.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 99
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Để tạo thêm tài khoản trong phần mềm ta thực hiện theo các bước nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hệ thống, Người dùng, Thêm, Nhập thông tin nhân sự, Chọn mã vai trò, Tích chọn kích hoạt và bấm cập nhật.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hệ thống, Người dùng, Thêm, Nhập thông tin nhân sự, nhập thông tin Tài khoản đăng nhập, Chọn mã vai trò, Tích chọn kích hoạt.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hệ thống, Người dùng, Thêm, Nhập thông tin nhân sự, nhập thông tin Tài khoản đăng nhập, Chọn mã vai trò, Tích chọn kích hoạt và bấm cập nhật.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hệ thống, Người dùng, Nhập thông tin nhân sự, nhập thông tin Tài khoản đăng nhập, Chọn mã vai trò, Tích chọn kích hoạt và bấm cập nhật.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 100
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo quy trình, cơ quan nào có thẩm quyền kiểm tra Báo cáo số 3, quyết định công nhận kết quả thi và in văn bằng chứng chỉ?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cơ sở đào tạo') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hội đồng thi') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Cán bộ coi thi') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Sở xây dựng') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 101
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Để chỉnh sửa báo cáo, biểu mẫu chúng ta cần thao tác như sau:') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chọn Edit, tùy chỉnh báo cáo như ý Mở báo cáo ở chế độ xem in rồi bấm Save') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Mở báo cáo ở chế độ xem in, Chọn Edit, tùy chỉnh báo cáo như ý rồi bấm Save') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chọn Edit, tùy chỉnh báo cáo như ý rồi bấm Save') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Mở báo cáo ở chế độ xem in, tùy chỉnh báo cáo như ý rồi bấm Save') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 102
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Check box (ô) “Tự động thu” có chức năng gì?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi hết thời gian làm bài máy giám thị sẽ tự động thu bài của học viên.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hết thời gian làm bài hoặc khi học viên nộp bài, máy giám thị sẽ thu bài và in bài làm của học viên ra máy in.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Không có chức năng gì cả.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi học viên nộp bài, máy giám thị sẽ tự động thu bài của học viên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 103
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Giám thị nhấn “Phát đề” khi nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi đã cho hết học viên trong ca vào phòng thi.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi có trạng thái “Đã đăng nhập” trên màn hình của máy giám thị.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi học viên đã đăng nhập thành công vào ca thi.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi có trạng thái “Đã tạo” trên màn hình của máy giám thị.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 104
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Các bước thao tác trên phần mềm của cơ sở đào tạo sau khi tổ chức đào tạo và trước khi tổ chức thi, kiểm tra?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tổng kết điểm, xét điều kiện dự thi, nhập điểm kết thúc các môn học, khóa báo cáo 2.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khóa báo cáo 2, nhập điểm kết thúc các môn học, tổng kết điểm, xét điều kiện dự thi.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập điểm kết thúc các môn học, tổng kết điểm, xét điều kiện dự thi, khóa báo cáo 2.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Xét điều kiện dự thi, tổng kết điểm, nhập điểm kết thúc các môn học, khóa báo cáo 2.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 105
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Những thông tin nào sau đây trong báo cáo có thể chỉnh sửa?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả thông tin trong báo cáo') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các trường dữ liệu Tiếng việt') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các trường dữ liệu Tiếng anh') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thông tin học viên') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 106
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Mã lớp học được quy ước theo cách nào so với các mã khác?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Giống mã số học viên') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tên hạng khóa/năm-CSĐT') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Giống mã khóa') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tên hạng viết tắt. Khóa/năm-CSĐT.SỐ') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 107
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Theo "Quy trình Quản lý thi tuyển trực tuyến", môn Lý thuyết tổng hợp được tổ chức thi dưới hình thức nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thi trắc nghiệm trực tuyến') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thi viết tự luận') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thi vấn đáp') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thi thực hành') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 108
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trường hợp “Nhập HS học viên từ excel” bị lỗi là do?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Các trường dữ liệu trong file excel sai kiểu số liệu') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Máy tính chưa cài đặt phần mềm Excel của Microsoft.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chưa thực hiện thao tác tạo khóa, lớp.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Tất cả các ý trên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 109
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trường hợp không chọn “Check box” ô “ Tự động thu” khi xuất hiện trạng thái “Nộp bài” thì giám thi phải thao tác như thế nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thao tác chọn học viên có trạng thái “Nộp bài” rồi bấm “Buộc thu bài” và in bài làm của học viên.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm tổ hợp phím Ctr + A rồi bấm “Thu bài” và in bài làm của học viên.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thao tác chọn học viên có trạng thái “Nộp bài” rồi bấm “Thu bài” và in bài làm của học viên.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm tổ hợp phím Ctr + A chuột phải chọn rồi bấm “Thu bài” và in bài làm của học viên.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 110
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Để bù giờ cho học viên phải thao tác?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập số phút bù giờ ở cột bù giờ và bấm “Cập nhật”') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập số phút bù giờ ở cột bù giờ và bấm “Phát đề”') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập số phút bù giờ ở cột bù giờ và bấm “Cho thi tiếp”') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhập số phút bù giờ ở cột bù giờ và bấm “Đóng”') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 111
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Mã số học viên của học viên đầu tiên "Lớp Thợ máy khóa 1 năm 2025 tại cơ sở đào tạo Trường CĐ Hàng hải & Đường Thủy II" được tạo theo định dạng nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'TM.K01/2025-DT2.001') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'K01/2025-DT2.TM.001') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '001.TM.K01/2025-DT2') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'DT2.TM.K01/2025.001') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 112
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trước khi khóa Báo cáo 3, Hội đồng thi kiểm tra cần thực hiện thao tác nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hệ thống, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Báo cáo, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Quản lý đào tạo, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Quản lý học viên, xét kết quả thi, Chọn thông tin kỳ thi sau đó bấm cập nhật.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 113
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trường hợp tích chọn ô “Tự động thu” mà máy giám thị không in bài thi của học viên thì phải làm thế nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thao tác chọn học viên chưa in bài thi bấm chuột phải chọn “Nạp lại”.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thao tác chọn học viên chưa in bài thi bấm “Buộc thu bài”') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thao tác chọn học viên chưa in bài thi bấm chuột phải chọn “Xuất đề thi và đáp án".') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Thao tác chọn học viên chưa in bài thi bấm chuột phải In/Bài thi.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 114
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Để dễ quan sát các trạng thái của ca thi giám thị có thể thao tác như thế nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm vào tiêu đề “Số báo danh” của thí sinh để sắp xếp.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm vào tiêu đề “Tên” của thí sinh để sắp xếp.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm vào tiêu đề “Trang thái” của bài thi để sắp xếp') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm vào tiêu đề “Giờ bắt đầu” của bài thi để sắp xếp.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 115
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Hội đồng thi, kiểm tra thao tác như thế nào để lấy được điểm của bài thi trực tuyến vào Điểm thi theo kỳ?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Trắc nghiệm, Chọn thông tin kỳ thi, Tổng hợp bài thi trực tuyến sau đó bấm cập nhật điểm') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Quản lý đào tạo, Nhập điểm thi theo kỳ, Tổng hợp bài thi trực tuyến sau đó bấm cập nhật.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Trắc nghiệm, Tổng hợp bài thi trực tuyến, Chọn thông tin kỳ thi sau đó bấm cập nhật điểm') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Quản lý đào tạo, Nhập điểm thi theo kỳ, Nhập điểm của học viên sau đó bấm cập nhật.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 116
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trường hợp nào phải bấm “Buộc thu bài” của học viên?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Học viên vi phạm quy chế thi.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Hết giờ mà lỗi mạng không thu bài.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Học viên vi phạm quy chế thi hoặc hết giờ mà lỗi mạng không thu bài.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Khi hết giờ thi.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 117
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Để in được danh sách học viên có Tên đăng nhập và mật khẩu của ca thi phải thao tác như thế nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Nhấn chuột phải chọn In/Danh sách đăng nhập') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm tổ hợp phím Ctr + A vào danh sách học viên, nhấn chuột phải chọn In/Danh sách đăng nhập.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm tổ hợp phím Ctr + A vào danh sách học viên, nhấn chuột phải chọn “Xuất đề thi và đáp án”.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm tổ hợp phím Ctr + A vào danh sách học viên, nhấn chuột phải chọn In/Bài thi.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 118
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Ví dụ về Mã khóa học Mã khóa học cho "Khóa thuyền trưởng hạng nhất khóa 7 năm 2025 tại cơ sở đào tạo Trường CĐ Hàng hải và Đường thủy II" sẽ được định dạng như thế nào theo quy ước?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'K07/2025-DT2.T1') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'K07/2025') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'CCCM THUYỀN TRƯỞNG HẠNG NHẤT K07/2025-DT2') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'T1.K07/2025-DT2.001') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a1_id WHERE id = q_id;

    -- Question 119
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Không đăng ký được học viên thi lại ở các khóa trước vào khóa hiện tại là do?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chưa khóa báo cáo 1 của khóa hiện tại') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chưa xét kết quả thi và khóa báo cáo 3 của các khóa trước.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, '') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chưa xét kết quả thi của các khóa trước.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a2_id WHERE id = q_id;

    -- Question 120
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Tên khóa học 2 Nếu một Cơ sở đào tạo có các hạng LPT, TT thi chung khóa 01 năm 2025, tên khóa học 2 sẽ được đặt chung là gì?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'CCCM CHUNG K01/2025-CSĐT') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'LPT.TT.K01/2025') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'K01/2025') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'K01/2025-LPT.TT') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

    -- Question 121
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Khi gặp sự cố về Hạ tầng thi (Máy tính, mạng) làm ảnh hưởng đến kết quả của học viên, để đảm bảo lợi ích của học viên Hội đồng thi, kiểm tra cần xử lý thế nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Lập biên bản ghi nhận sự việc, cho học viên thi lại vào đợt sau.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Lập biên bản ghi nhận sự việc, Hội đồng xử lý trực tiếp trên phần mềm theo biên bản.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Lập biên bản ghi nhận sự việc, cán bộ coi thi, kiểm tra thao tác trên phần mềm theo biên bản.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Lập biên bản ghi nhận sự việc, báo cho bộ phận Quản trị phần mềm xử lý như đề xuất của hội đồng trong biên bản.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a4_id WHERE id = q_id;

    -- Question 122
    INSERT INTO questions (subject_id, text) VALUES ('gk-lt-chung', 'Trên máy học viên hiển thị thông báo "Học viên đã được đăng nhập trên máy tính khác” xử lý thế nào?') RETURNING id INTO q_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chuột phải tích chọn đúng học viên đó và bấm nút “Tạm dừng”.') RETURNING id INTO a1_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chuột phải tích chọn đúng học viên đó và bấm nút “Buộc thu bài”.') RETURNING id INTO a2_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Chuột phải tích chọn đúng học viên đó và bấm nút “Buộc login lại”.') RETURNING id INTO a3_id;
    INSERT INTO answers (question_id, text) VALUES (q_id, 'Bấm tổ hợp phím Ctr + A vào danh sách học viên chuột phải tích chọn và bấm nút “Buộc login lại”.') RETURNING id INTO a4_id;
    UPDATE questions SET correct_answer_id = a3_id WHERE id = q_id;

END $$;
