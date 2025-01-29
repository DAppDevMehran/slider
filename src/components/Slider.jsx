import { useEffect, useState } from "react";
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from "react-icons/bs";

import "./style.css";

export default function Slider({ url, limit = 5, page = 1 }) {
  const [images, setImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch images
  async function fetchImages() {
    setLoading(true);
    setErrorMsg(null); // Reset error message on each fetch

    try {
      const response = await fetch(`${url}?page=${page}&limit=${limit}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setImages(data);
      } else {
        setErrorMsg("No images found.");
      }
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Handlers for navigation
  function handlePrevious() {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? images.length - 1 : prevSlide - 1
    );
  }

  function handleNext() {
    setCurrentSlide((prevSlide) =>
      prevSlide === images.length - 1 ? 0 : prevSlide + 1
    );
  }

  // Fetch images when the URL, page, or limit changes
  useEffect(() => {
    if (url) fetchImages();
  }, [url, page, limit]);

  // Render loading, error, or slider
  if (loading) {
    return <div>Loading data, please wait...</div>;
  }

  if (errorMsg) {
    return <div>We have an error: {errorMsg}</div>;
  }

  return (
    <div className="container">
      <BsArrowLeftCircleFill
        onClick={handlePrevious}
        className="arrow arrow-left"
      />

      {images.length > 0 && (
        <img
          key={images[currentSlide].id}
          alt={images[currentSlide].download_url}
          src={images[currentSlide].download_url}
          className="current-image"
        />
      )}

      <BsArrowRightCircleFill
        onClick={handleNext}
        className="arrow arrow-right"
      />

      <span className="circle-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            className={`current-indicator ${
              currentSlide === index ? "" : "inactive-indicator"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </span>
    </div>
  );
}
