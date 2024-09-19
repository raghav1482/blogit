import "../styles/footer.css"
const Footer = () => {
    return (
      <section className="footer">
  
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section about">
            <h4>BLOGIT</h4>
            <p>
            BLOGIT is your go-to platform for sharing insights, thoughts, and
  ideas on various topics. Whether you're passionate about technology,
  health, education, or lifestyle, BLOGIT offers a space for everyone
  to express their opinions and engage with a like-minded community.<br/>
  Our mission is to empower writers and thinkers by giving them a platform
  to reach a broader audience, inspire meaningful conversations, and
  foster creativity. Join our community and make your voice heard. 
  Write, share, connect, and grow with BLOGIT.
            </p>
          </div>
  
          {/* Categories Section */}
          <div style={{display:"flex",flex:"1",justifyContent:"space-around",flexWrap:"wrap"}}>
          <div className="footer-section categories">
            <h4>Categories</h4>
            <ul>
              <li><a href="/category/tech">Tech</a></li>
              <li><a href="/category/lifestyle">Lifestyle</a></li>
              <li><a href="/category/education">Education</a></li>
              <li><a href="/category/health">Health</a></li>
              <li><a href="/category/business">Business</a></li>
            </ul>
          </div>
  
          {/* Quick Links Section */}
          <div className="footer-section links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
            </ul>
          </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Footer;
  