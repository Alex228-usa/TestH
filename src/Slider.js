import React, { useEffect, useState } from 'react';
import { interval, from, merge, timer } from 'rxjs';
import { mergeMap, map, takeWhile, tap, switchMap } from 'rxjs/operators';
import axios from 'axios';

const Slider = ({ displayTime, slidesToShow, apiUrl }) => {
  const [slides, setSlides] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    // Function to fetch slides from the API
    const fetchSlides = async () => {
      try {
        const response = await axios.get(apiUrl);
        setSlides(response.data);
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      }
    };

    fetchSlides();

    // Set up an interval to automatically advance the slides
    const slideInterval = interval(displayTime).pipe(
      takeWhile(() => true), // Continue indefinitely
      tap(() => {
        // Move to the next slide index
        setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
      })
    );

    // Start the slide interval
    const subscription = slideInterval.subscribe();

    return () => {
      subscription.unsubscribe(); // Clean up the subscription on component unmount
    };
  }, [displayTime, apiUrl, slides.length]);

  return (
    <div className="slider">
      {slides.slice(currentSlideIndex, currentSlideIndex + slidesToShow).map((slide) => (
        <div key={slide.id} className="slide">
          <a href={slide.url} target="_blank" rel="noopener noreferrer">
            <img src={slide.image} alt="Slide" />
          </a>
        </div>
      ))}
    </div>
  );
};

export default Slider;
