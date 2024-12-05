import React from "react";

const Footer = () => {
  let handleheartBlast = document.querySelector(".heart");
  function heartBlast() {
    return handleheartBlast.classList.toggle("heart-blast");
  }
  var d = new Date();
  return (
    <div className="footer">
      <div className="copyright border-top">
        <p className="fs-12">
          Made with <span className="heart" onClick={() => heartBlast()}></span>{" "}
          by CodeWave
        </p>
      </div>
    </div>
  );
};

export default Footer;
