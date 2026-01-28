// Đánh dấu đây là "Client Component"
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../utils/supabaseClient' 

// "Triệu hồi" thư viện Slider
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';

// "Triệu hồi" CSS của Slider
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// "Triệu hồi" file CSS Module của mình
import styles from './FeaturedSlider.module.css'

// 1. Định nghĩa "kiểu" của Tin tiêu điểm
type FeaturedPost = {
  id: string;
  title: string;
  thumbnail_url: string; 
}

export default function FeaturedSlider() {
  const [posts, setPosts] = useState<FeaturedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. "Phép thuật" Tự động lấy tin
  useEffect(() => {
    async function getFeaturedPosts() {
      console.log('[Slider] Đang lấy Tin Tiêu Điểm...');
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('id, title, thumbnail_url')
        .eq('is_featured', true) // (Chỉ lấy tin "Tiêu điểm")
        .not('thumbnail_url', 'is', null) // (Bắt buộc phải có ảnh đại diện)
        .order('created_at', { ascending: false }) // (Mới nhất lên đầu)
        .limit(5); // (Lấy 5 tin)

      if (error) {
        console.error('Lỗi lấy Tin Tiêu Điểm cho Slider:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    getFeaturedPosts();
  }, []);

  if (loading) {
    return (
      <div className={styles.sliderContainer} style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <p>Đang tải Slider...</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return null; // (Nếu không có tin tiêu điểm nào thì "im lặng" luôn)
  }

  // 3. "Vẽ" Giao diện Slider
  return (
    <div className={styles.sliderContainer}>
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={0} // (Không khoảng cách)
        slidesPerView={1} // (Mỗi lần 1 slide)
        loop={true} // (Chạy vòng lặp)
        pagination={{ clickable: true }} // (Cho bấm nút tròn ở dưới)
        navigation={true} // (Cho 2 nút mũi tên 2 bên)
        autoplay={{
          delay: 4000, // (4 giây 1 slide)
          disableOnInteraction: false,
        }}
        className={styles.mySwiper}
      >
        {posts.map((post) => (
          <SwiperSlide key={post.id}>
            <Link href={`/bai-viet/${post.id}`}>
              {/* Ảnh nền */}
              <div 
                className={styles.slideBackground}
                style={{ backgroundImage: `url(${post.thumbnail_url})` }}
              ></div>
              {/* Lớp mờ */}
              <div className={styles.slideOverlay}></div>
              {/* Tiêu đề */}
              <div className={styles.slideContent}>
                <h2>{post.title}</h2>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}