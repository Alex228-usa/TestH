import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { interval, from } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';

const Slider = ({ displayTime, slidesToShow, slideDataApiUrl }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    // Fetch slide data from the provided API URL
    const fetchSlides = async () => {
      try {
        const response = await axios.get(slideDataApiUrl);
        setSlides(response.data);
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      }
    };

    fetchSlides();
  }, [slideDataApiUrl]);

  useEffect(() => {
    const slide$ = interval(displayTime).pipe(
      mergeMap(() => from(slides)),
      map((slide, index) => {
        const priority = slide.priority || 1;
        const repeats = Math.floor(priority);
        const lastPriority = priority - repeats;
        const repeatSlides = Array(repeats).fill(slide);
        return [...repeatSlides, { ...slide, priority: lastPriority }];
      }),
      mergeMap((slide) => from(slide))
    );

    const subscription = slide$.subscribe(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [slides, displayTime]);

  return (
    <div className="slider">
      {slides.slice(currentSlideIndex, currentSlideIndex + slidesToShow).map((slide, index) => (
        <div key={slide.id} className="slide">
          <a href={slide.url}>
            <img src={slide.image} alt="Slide" />
          </a>
        </div>
      ))}
    </div>
  );
};

export default Slider;

