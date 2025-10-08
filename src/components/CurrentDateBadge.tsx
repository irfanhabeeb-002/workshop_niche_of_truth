import { useEffect, useState } from "react";
import styled from 'styled-components';

const dayNames = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

const CurrentDateBadge = () => {
  const [dayName, setDayName] = useState("");
  const [dateLabel, setDateLabel] = useState("");
  const [timeLabel, setTimeLabel] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setDayName(dayNames[now.getDay()]);
      const d = now.getDate();
      const m = now.getMonth() + 1;
      const y = now.getFullYear();
      setDateLabel(`${d}/${m}/${y}`);
      setTimeLabel(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <StyledWrapper>
      <div className="card-time-cloud">
        <div className="card-time-cloud-front" />
        <div className="card-time-cloud-back">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ed782a" d="M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z" transform="translate(100 100)" />
          </svg>
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ed782a" d="M39.1,-11.5C46.9,11.5,47,38.1,34.9,46.6C22.8,55.1,-1.6,45.4,-16.5,32.3C-31.3,19.2,-36.8,2.8,-32.4,-15.3C-28.1,-33.4,-14.1,-53,0.8,-53.3C15.6,-53.5,31.2,-34.4,39.1,-11.5Z" transform="translate(100 100)" />
          </svg>
        </div>
        <p className="card-time-cloud-day">{dayName}</p>
        <p className="card-time-cloud-day-number">{dateLabel}</p>
        <p className="card-time-cloud-hour">{timeLabel}</p>
        <div className="card-time-cloud-icon">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth={0} />
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
            <g id="SVGRepo_iconCarrier">
              <path d="M8 22H16" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M5 19H19" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 16H22" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 6C8.68629 6 6 8.68629 6 12C6 13.5217 6.56645 14.911 7.5 15.9687H16.5C17.4335 14.911 18 13.5217 18 12C18 8.68629 15.3137 6 12 6Z" stroke="#ed782a" strokeWidth="1.44" />
              <path d="M12 2V3" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" />
              <path d="M22 12L21 12" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" />
              <path d="M3 12L2 12" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" />
              <path d="M19.0708 4.92969L18.678 5.32252" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" />
              <path d="M5.32178 5.32227L4.92894 4.92943" stroke="#ed782a" strokeWidth="1.44" strokeLinecap="round" />
            </g>
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card-time-cloud {
    position: relative;
    border-radius: 1em;
    width: 17.5em;
    height: 8em;
    z-index: 2;
    border: solid 0.15em var(--color1);
    transition: 0.5s all ease-in-out;
    box-shadow: 0em 0em rgb(0, 0, 0, 0.25);
    overflow: hidden;
    --color1: rgb(237, 120, 42);
    --skycolor: #ffffff;
  }

  .card-time-cloud-front {
    width: 20em;
    height: 12.5em;
    background: rgb(228, 228, 228);
    border-radius: 1em;
    position: absolute;
    z-index: 2;
    top: 95%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.5s all ease-in-out;
  }

  .card-time-cloud-back {
    width: 20em;
    height: 17.5em;
    background: var(--skycolor);
    border-radius: 1em;
    position: absolute;
    z-index: 1;
    top: 57.5%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: 0.5s all ease-in-out;
  }

  .card-time-cloud:hover {
    margin-bottom: 1em;
    box-shadow: 0em 1em rgb(237, 120, 42, 0.5);
  }

  .card-time-cloud:hover .card-time-cloud-front {
    top: 105%;
  }

  .card-time-cloud-back svg {
    position: absolute;
    z-index: 1;
    top: -16.45em;
    left: -7.5em;
    width: 25em;
    height: auto;
    opacity: 100%;
    animation: rotate-cloud 15s linear infinite;
  }

  .card-time-cloud-back svg:nth-child(2) {
    animation: rotate-cloud 15s linear infinite 1s;
    opacity: 50%;
  }

  @keyframes rotate-cloud {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .card-time-cloud-day {
    color: var(--color1);
    position: absolute;
    z-index: 3;
    top: 1.25em;
    left: 0.5em;
    font-size: 1.5em;
    font-weight: bold;
    transition: 0.5s all ease-in-out;
  }

  .card-time-cloud-day-number {
    color: var(--color1);
    position: absolute;
    z-index: 3;
    top: 3em;
    left: 0.65em;
    font-size: 1.25em;
    transition: 0.5s all ease-in-out;
    font-weight: 500;
  }

  .card-time-cloud-hour {
    color: var(--color1);
    position: absolute;
    z-index: 3;
    top: 1.25em;
    right: 0.5em;
    font-size: 1.5em;
    font-weight: bold;
    transition: 0.5s all ease-in-out;
  }

  .card-time-cloud:hover {
    height: 15em;
  }

  .card-time-cloud:hover .card-time-cloud-day {
    top: 2.25em;
  }

  .card-time-cloud:hover .card-time-cloud-day-number {
    top: 4em;
  }

  .card-time-cloud:hover .card-time-cloud-hour {
    top: 1em;
    font-size: 3em;
  }

  .card-time-cloud-icon svg {
    position: absolute;
    z-index: 4;
    top: 4em;
    right: 0.6em;
    transform: rotate(0deg);
    width: 1.5em;
    height: auto;
    transition: 0.5s all ease-in-out;
  }

  .card-time-cloud:hover .card-time-cloud-icon svg {
    top: 7.25em;
    right: -1.75em;
    width: 7.5em;
    height: auto;
    transform: rotate(-35deg);
  }
  .card-time-cloud:active {
    transition: 0.25s all ease-in-out;
    transform: scale(0.95);
  }

  .card-time-cloud:active .card-time-cloud-front {
    transition: 0.25s all ease-in-out;
    top: 120%;
    background-color: var(--color1);
  }

  .card-time-cloud:active .card-time-cloud-icon svg {
    transition: 0.25s all ease-in-out;
    top: 8em;
    transform: rotate(-25deg);
    stroke: #4a4b55;
  }`;

export default CurrentDateBadge;
