import React, { useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import "./About.scss";
import Console from "../../assets/console.jpg";
import Sound from "../../assets/sound.jpg";
import Battery from "../../assets/battery.jpg";
import Picturea from "../../assets/picturea.jpg";
import Pictureb from "../../assets/pictureb.jpg";
import Picturec from "../../assets/picturec.jpg";
import Pictured from "../../assets/pictured.jpg";
import Picturee from "../../assets/picturee.jpg";
import Picturef from "../../assets/picturef.PNG";
import Pictureg from "../../assets/pictureg.jpg";
export default function App() {
  useEffect(() => {
    
    //window.scrollTo(0, 15);
  
    

  }, []); // The empty array ensures this effect runs only once after the initial render

  return (
    <div style={{ height: '300%' }}>
      <div style={{ width: '100%', height: '100%' }}>
        <Spline scene="https://prod.spline.design/B5O4lUSNlh1ivT7o/scene.splinecode" />
      </div>

      {/* Adding evenly spaced text layout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '150px', width: '100%' }}>
        <div style={{ flex: 1, textAlign: 'left', padding: '0 20px', maxWidth: '445px' }}>
          <span style={{fontSize: '45px',fontFamily:'Poetsen One'}}>50% lighter</span>
          <p style={{fontSize:'26px',fontFamily:'Poetsen One'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
        </div>
        <div style={{ flex: 1, textAlign: 'left', padding: '0 20px',maxWidth: '445px',marginLeft:' 100px',marginBottom:' 8px'  }}>
        <span style={{fontSize: '45px',fontFamily:'Poetsen One'}}>5 years warranty</span>
          <p style={{fontSize:'23px',fontFamily:'Poetsen One'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
        </div>
        <div style={{ flex: 1, textAlign: 'left', padding: '0 20px',maxWidth: '445px',marginLeft:' 100px',marginBottom:' 13px'   }}>
        <span style={{fontSize: '45px',fontFamily:'Poetsen One'}}>Faster</span>
        <p style={{fontSize:'23px',fontFamily:'Poetsen One'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.</p>
        </div>
      </div>

      
      <div style={{ display: 'flex', width: '100%', height: '100vh' }}>
      {/* Text section */}
      <div style={{ width: '40%', padding: '140px' }}>
      <span style={{fontSize: '38px',fontFamily:'Poetsen One',lineHeight:'30px'}}>Carbon fiber frame with a sleek design</span>
      <p style={{fontSize:'23px',fontFamily:'Poetsen One', marginTop:'350px'}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris exercitation ullamco laboris.</p>
      <button style={{
  fontSize: '16px',
  padding: '15px 30px',
  margin: '20px 0',
  backgroundColor: '#000', // Dark background
  color: '#fff', // Light text
  border: 'none',
  borderRadius: '5px', // Rounded corners
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow
  cursor: 'pointer', // Cursor indicates the button can be clicked
  transition: 'all 0.3s' // Smooth transition for hover effects
}} 
onMouseOver={({target})=>target.style.transform = 'scale(1.05)'}
onMouseOut={({target})=>target.style.transform = 'scale(1)'}
onClick={() => {
  window.scrollTo({
    top: 8000, // Y coordinate
    left: 0, // X coordinate
    behavior: 'smooth' // Smooth scrolling
  });
}}
>
  Pre-Order ($1,200)
</button>

      </div>
      

      <div style={{ width: '60%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ width: '1px', backgroundColor: '#ccc', height: '800px',marginRight: '50px' }}></div>
        <Spline scene="https://prod.spline.design/wR998PKtlF1va9Vw/scene.splinecode" />
      </div>
    </div>


    <div style={{ width: '100%',height: '100%' }}>
        <Spline scene="https://prod.spline.design/Ts71x3wd4pwvZh4K/scene.splinecode" />
      </div>


      


      <div style={{ display: 'flex', width: '100%', height: '80vh' }}>
      {/* Main title section occupying 40% of the width */}
      <div style={{
        width: '40%',
        background: '#fff', // White background for distinction
        display: 'flex',
        flexDirection: 'column', // Stack children vertically
        justifyContent: 'flex-start', // Align content to the top
        alignItems: 'center', // Center content horizontally
        paddingTop: '5%', // Add padding at the top to shift everything down a bit
        paddingLeft: '5%',
      }}>
        <span style={{fontFamily: 'Poetsen One', fontSize: '50px', textAlign: 'left', marginBottom: '20px',lineHeight:'50px' }}>
          Quality components for increased durability
        </span>
        <span style={{fontFamily: 'Poetsen One', fontSize: '20px', textAlign: 'left', marginTop: '306px',lineHeight:'30px' }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex.
        </span>
      </div>
      <div style={{ width: '1px', backgroundColor: '#ccc', height: '670px',marginRight: '50px',marginLeft:'70px', marginTop:'45px' }}></div>
      {/* Component features section occupying 60% of the width */}
      <div style={{
        width: '60%',
        display: 'flex',
        justifyContent: 'space-between', // Distribute children evenly with space between
        alignItems: 'flex-start', // Align children to the top
        paddingLeft: '1%',// Adjust padding to push content upwards
        paddingTop: '5%',
      }}>
        <div style={{ flex: 1, textAlign: 'left', maxWidth: '445px' }}>
        <span style={{ fontSize: '25px', fontFamily: 'Poetsen One',}}>01.</span>

        <div style={{ fontSize: '45px', fontFamily: 'Poetsen One',marginTop: '20px'}}>Handle</div>
        <img style={{ width: '170px', height: '170px', marginTop:'180px',marginLeft:'40px' }} src={Console} />
          <p style={{ fontSize: '20px', fontFamily: 'Poetsen One', lineHeight:'30px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
          </p>
        </div>


        <div style={{ width: '1px', backgroundColor: '#ccc', height: '670px',marginRight: '50px',marginLeft:'30px', marginTop:'-55px' }}></div>


        <div style={{ flex: 1, textAlign: 'left', maxWidth: '445px' }}>
        <span style={{ fontSize: '25px', fontFamily: 'Poetsen One',}}>02.</span>
        <div style={{ fontSize: '45px', fontFamily: 'Poetsen One',marginTop: '20px'}}>Sound</div>
        <img style={{ width: '170px', height: '170px', marginTop:'180px',marginLeft:'40px' }} src={Sound} />
          <p style={{ fontSize: '20px', fontFamily: 'Poetsen One',lineHeight:'30px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
          </p>
        </div>


        <div style={{ width: '1px', backgroundColor: '#ccc', height: '670px',marginRight: '50px',marginLeft:'30px', marginTop:'-55px' }}></div>


        <div style={{ flex: 1, textAlign: 'left', maxWidth: '445px' }}>
        <span style={{ fontSize: '25px', fontFamily: 'Poetsen One',}}>03.</span>

        <div style={{ fontSize: '45px', fontFamily: 'Poetsen One',marginTop: '20px'}}>Battery</div>
        <img style={{ width: '170px', height: '140px', marginTop:'180px',marginLeft:'44px' }} src={Battery} />
          <p style={{ fontSize: '20px', fontFamily: 'Poetsen One',marginTop:'26px',lineHeight:'30px' }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna.
          </p>
        </div>
      </div>
    </div>


<div style={{ display: 'flex', width: '100%', height: '78.7vh' }}>
    <img style={{ width: '33.33%', height: '700px', marginTop:'50px'}} src={Picturea} />
    <img style={{ width: '33%.33', height: '700px', marginTop:'50px' }} src={Picturec} />
    <img style={{ width: '33%.33', height: '700px', marginTop:'50px' }} src={Pictureb} />
</div>
<div style={{ display: 'flex', width: '100%', height: '100vh' }}>
<img style={{ width: '60%', height: '100%' }} src={Pictured} />
<img style={{ width: '40%', height: '100%' }} src={Picturee} />
</div>

<div style={{ display: 'flex', width: '100%', height: '120vh' }}>
<img style={{ width: '100%', height: '100%' }} src={Picturef} />
</div>

<div style={{ display: 'flex', width: '100%', height: '16vh' }}>
<img style={{ width: '200px', height: '150px',marginLeft:'100px' }} src={Pictureg} />
</div>

<div style={{ display: 'flex', maxwidth: '100%', height: '7vh',marginLeft:'130px'  }}>
    <p style={{fontFamily: 'Poetsen One'}}>© 2021 MARVEL<br/>
       © 2021 Sony Interactive Entertainment LLC<br/>
       <p style={{fontFamily: 'Poetsen One'}}>Developed by Insomniac Games, Inc</p>
    </p>
      </div>

      <div style={{ display: 'flex', maxwidth: '100%', height: '3vh',marginLeft:'130px' ,marginTop:'20px' }}>
      <div style={{fontFamily: 'Poetsen One'}}><sup>1.</sup> Available when feature is supported by game.</div>
      </div>

      <div style={{ display: 'flex', maxwidth: '100%', height: '7.5vh',marginLeft:'128px' ,marginTop:'20px' }}>
      <div style={{fontFamily: 'Poetsen One'}}><sup>2.</sup>  Playing PS VR games on a PS5 console requires a PS VR headset, PlayStation Camera for PS4 (Model CUH-ZEY1 or CUH-ZEY2) and a PlayStation Camera adapter (no purchase required. Visit <a href="https://playstation.com/camera-adaptor" target="_blank" rel="noopener noreferrer">playstation.com/camera-adaptor</a> for details). For the best PS VR experience on PS5, we recommend using a DUALSHOCK 4 wireless controller. Selected games may require PlayStation Move motion controllers or be compatible with the PlayStation VR aim controller. The new HD camera for PS5 is not compatible with PS VR. The PS VR headset, PS Camera, DUALSHOCK 4 wireless controller, PS Move controllers and PS VR aim controller are all sold separately from PS5 console.</div>
      </div>
      
      <div style={{ display: 'flex', maxwidth: '100%', height: '5.5vh',marginLeft:'128px' ,marginTop:'20px'}}>
      <div style={{fontFamily: 'Poetsen One'}}><sup>3.</sup> Upgrade may be offered at no additional cost or for a fee and may be available for a limited time. To upgrade eligible PS4 disc titles to digital PS5 versions, you need a PS5 console with a disc drive. Streaming services may require paid subscription and may not be available in all countries. Internet and account for PlayStation Network required. Full terms apply: <a href="https://playstation.com/PSNTerms" target="_blank" rel="noopener noreferrer">playstation.com/PSNTerms</a>.</div>
      </div>

      <div style={{ display: 'flex', maxwidth: '100%', height: '3vh',marginLeft:'128px' ,marginTop:'20px'}}>
      <div style={{fontFamily: 'Poetsen One'}}>"PlayStation", "PlayStation Family Mark", "PS5 logo", "DualSense" and "Play Has No Limits" are registered trademarks or trademarks of Sony Interactive Entertainment Inc. "SONY" is a registered trademark of Sony Corporation</div>
      </div>

    </div>
  );
}
