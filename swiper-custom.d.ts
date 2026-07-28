import React from 'react';
import { SwiperContainer, SwiperSlide } from 'swiper/element';
import { SwiperOptions } from 'swiper/types';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Allows you to use <swiper-container> with normal HTML attributes + Swiper Options
      'swiper-container': React.DetailedHTMLProps<
        React.HTMLAttributes<SwiperContainer> & {
          init?: string | boolean;
          class?: string;
          // Add any specific inline attributes you plan on using
        },
        SwiperContainer
      >;
      // Allows <swiper-slide>
      'swiper-slide': React.DetailedHTMLProps<
        React.HTMLAttributes<SwiperSlide> & {
          class?: string;
        },
        SwiperSlide
      >;
    }
  }
}