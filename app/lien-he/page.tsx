// 💖 1. BIẾN THÀNH CLIENT COMPONENT 💖
'use client'

import React, { useState } from 'react' // (Thêm "não" useState)
import Link from 'next/link'
import styles from './page.module.css' 
import Sidebar from '../../components/Sidebar' 

// 💖 2. "TRIỆU HỒI" BƯU ĐIỆN FORMSPREE 💖
import { useForm, ValidationError } from '@formspree/react';


export default function LienHePage() {
  
  // (Anh dán cái link "bưu điện" ở Chặng 1 vào đây nha)
  // (Em giữ nguyên cái ID anh gửi lần trước, nếu sai anh đổi lại nha)
  const FORMSPREE_ID = 'xjkjlvpz'; 
  
  const [state, handleSubmit] = useForm(FORMSPREE_ID);

  return (
    <>
      <div className={styles.layoutGrid}>
        {/* ===== CỘT TRÁI (NỘI DUNG LIÊN HỆ) ===== */}
        <main className={styles.mainContent}>
          
          {/* Box Thông tin Liên hệ (Giữ nguyên) */}
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>Liên hệ</h2>
            <div className={styles.contactInfo}>
              <h3>CÔNG TY CỔ PHẦN TƯ VẤN VÀ GIÁO DỤC NINH BÌNH</h3>
              <p><strong>Địa chỉ:</strong> Đường Triệu Việt Vương - Phường Hoa Lư - Tỉnh Ninh Bình </p>
              <p><strong>MST:</strong> 2700960947</p>
              <p><strong>Điện thoại:</strong> (Anh điền SĐT vào đây) 022.96.282.969 </p>
              <p><strong>Email:</strong> ninhbinheduco.jsc@gmail.com </p>
	      <p><strong>      </strong> giaoducninhbinh@daotaothuyenvien.com </p>
            </div>
          </section>

          {/* 💖 4. FORM LIÊN HỆ MỚI "XỊN" 💖 */}
          <section className={styles.widgetBox}>
            <h2 className={styles.widgetTitle}>Gửi tin nhắn cho chúng tôi</h2>
            
            <div className={styles.formContainer}>
              
              {/* (Nếu gửi thành công, nó hiện cái này) */}
              {state.succeeded ? (
                <p className={`${styles.formStatus} ${styles.success}`}>
                  Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công. 
                  Chúng tôi sẽ phản hồi sớm nhất có thể!
                </p>
              ) : (
                
                /* (Nếu chưa, nó hiện cái Form) */
                <form onSubmit={handleSubmit} className={styles.form}>
                  {/* Ô Họ và Tên */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>
                      Họ và Tên
                    </label>
                    <input
                      id="name"
                      type="text" 
                      name="name" // (Formspree nó "nhận" cái tên này)
                      className={styles.input}
                      required
                    />
                  </div>
                  
                  {/* Ô Email */}
                  <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>
                      Email của bạn
                    </label>
                    <input
                      id="email"
                      type="email" 
                      name="email" // (Formspree nó "nhận" cái tên này)
                      className={styles.input}
                      required
                    />
                    <ValidationError 
                      prefix="Email" 
                      field="email"
                      errors={state.errors}
                      className={styles.error}
                    />
                  </div>
                  
                  {/* Ô Số điện thoại */}
                  <div className={styles.formGroup}>
                    <label htmlFor="phone" className={styles.label}>
                      Số điện thoại (Không bắt buộc)
                    </label>
                    <input
                      id="phone"
                      type="tel" 
                      name="phone"
                      className={styles.input}
                    />
                  </div>

                  {/* Ô Nội dung */}
                  <div className={styles.formGroup}>
                    <label htmlFor="message" className={styles.label}>
                      Nội dung tin nhắn
                    </label>
                    <textarea
                      id="message"
                      name="message" // (Formspree nó "nhận" cái tên này)
                      className={styles.textarea}
                      required
                    />
                    <ValidationError 
                      prefix="Message" 
                      field="message"
                      errors={state.errors}
                      className={styles.error}
                    />
                  </div>
                  
                  {/* 💖 5. SỬA LỖI Ở ĐÂY (DÙNG "CHÌA KHÓA" getFormErrors()) 💖 */}
                  {state.errors && state.errors.getFormErrors().length > 0 && (
                    <p className={`${styles.formStatus} ${styles.error}`}>
                      {state.errors.getFormErrors()[0].message || 'Lỗi khi gửi, vui lòng thử lại.'}
                    </p>
                  )}

                  {/* Nút Gửi */}
                  <div>
                    <button type="submit" disabled={state.submitting} className={styles.button}>
                      {state.submitting ? 'Đang gửi...' : 'Gửi tin nhắn'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

        </main>

        {/* ===== CỘT PHẢI (SIDEBAR) ===== */}
        <Sidebar />
      </div>
    </>
  )
}