import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BACKEND_URL } from '../constants';
import playerBg from '../assets/playerCard.jpeg'
import ReactDOM from 'react-dom/client'; // Import createRoot from React 18
import { format } from 'path';
import soldImg from '../assets/sold.png'
import { Button } from '@/components/ui/button';
import { Download } from "lucide-react";




interface props{
    playerList:any
    teamName :any
}

const PDFCreator: React.FC<props> = ({playerList,teamName}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null); // To capture the player card
  const [isLoading, setIsLoading] = useState(false)


  const capitalizeFirst = (str: any) => {
    if (!str) return "";
    str = str.toLowerCase();
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

const generatePDF = async () => {
  setIsLoading(true);

  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 8;

  const loadImage = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Image loading failed");

      const blob = await response.blob();

      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => resolve("");
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const escapeHtml = (value) =>
    String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[char]);

  try {
    for (let index = 0; index < playerList.length; index++) {
      const player = playerList[index];

      const profileImage = await loadImage(
        `https://storage.googleapis.com/rajas_pl/${player.profile_image}`
      );

      const cardWidth = 900;
      const cardHeight = 1100;

      const tempDiv = document.createElement("div");

      tempDiv.style.cssText = `
  position: fixed;
  left: -10000px;
  top: 0;
  width: ${cardWidth}px;
  height: ${cardHeight}px;
  background: #f1f5f9;
  overflow: hidden;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  border: 3px solid #0f766e;
  border-radius: 24px;
`;

     tempDiv.innerHTML = `
  <div style="
    position:relative;
    width:100%;
    height:100%;
    background:linear-gradient(180deg,#f8fafc 0%,#ffffff 65%,#ecfdf5 100%);
  ">

    <!-- Header -->
    <div style="
      height:100px;
      background:linear-gradient(120deg,#0f172a,#134e4a);
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      color:white;
    ">
      <div style="
        font-size:30px;
        font-weight:900;
        letter-spacing:4px;
      ">NILESHWAR PREMIER LEAGUE SEASON 11</div>

     

    <!-- Player Image -->
    <div style="
      position:absolute;
      top:130px;
      left:50%;
      transform:translateX(-50%);
      width:430px;
      height:510px;
      padding:10px;
      background:white;
      border:5px solid #10b981;
      border-radius:24px;
      box-shadow:0 10px 25px rgba(15,23,42,0.15);
      box-sizing:border-box;
    ">
      ${
        profileImage
          ? `<img src="${profileImage}" style="
              width:100%;
              height:100%;
              object-fit:cover;
              border-radius:14px;
            "/>`
          : `<div style="
              display:flex;
              height:100%;
              align-items:center;
              justify-content:center;
              color:#64748b;
            ">No Profile Image</div>`
      }
    </div>

    <!-- SOLD Badge -->
    ${
      player.bid_amount
        ? `
          <div style="
            position:absolute;
            top:210px;
            right:35px;
            display:flex;
            flex-direction:column;
            align-items:center;
            gap:8px;
            background:#052e16;
            border:3px solid #34d399;
            padding:14px 20px;
            border-radius:16px;
            box-shadow:0 5px 15px rgba(0,0,0,0.2);
          ">
            <span style="
              color:#86efac;
              font-size:23px;
              font-weight:900;
              letter-spacing:2px;
            ">SOLD</span>

            <span style="
              color:#facc15;
              font-size:24px;
              font-weight:900;
            ">₹${escapeHtml(player.bid_amount)}</span>
          </div>
        `
        : ""
    }

    <!-- Player ID -->
    <div style="
  position:absolute;
  top:650px;
  left:50%;
  transform:translateX(-50%);
  width:max-content;
  max-width:790px;
  box-sizing:border-box;
  background:#064e3b;
  color:white;
  padding:12px 35px;
  border-radius:30px;
  font-size:27px;
  font-weight:900;
  letter-spacing:2px;
  border:3px solid #6ee7b7;
  text-align:center;
  white-space:normal;
  overflow-wrap:anywhere;
">
  #${escapeHtml(player.id)}. ${escapeHtml(player.fullname?.toUpperCase())}
</div>

    <!-- Divider -->
    <div style="
      position:absolute;
      top:875px;
      left:15%;
      width:70%;
      height:4px;
      background:#10b981;
      border-radius:10px;
    "></div>

    <!-- Player Details - Two Column Layout -->
<div style="
  position:absolute;
  top:740px;
  left:55px;
  right:55px;
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
">

  ${[
    ["ROLE", player.player_role],
    ["BATTING STYLE", player.batting_style],
    ["BOWLING STYLE", player.bowling_style],
    ["LOCATION", capitalizeFirst(player.location || "")],
    ["PHONE NUMBER", player.contact_no]
  ].map(([label, value]) => `
    <div style="
      display:flex;
      flex-direction:column;
      justify-content:center;
      min-height:90px;
      background:#ffffff;
      border:1px solid #d1fae5;
      border-left:7px solid #059669;
      border-radius:12px;
      padding:15px 20px;
      box-sizing:border-box;
      box-shadow:0 3px 8px rgba(15,23,42,0.06);
    ">

      <span style="
        color:#047857;
        font-size:20px;
        font-weight:900;
        letter-spacing:1px;
        margin-bottom:7px;
      ">
        ${escapeHtml(label)}
      </span>

      <span style="
        color:#0f172a;
        font-size:25px;
        font-weight:bold;
        overflow-wrap:anywhere;
      ">
        ${escapeHtml(value || "-")}
      </span>

    </div>
  `).join("")}

</div>

    <!-- Pending Status -->
    ${
      player.status == 1
        ? `
          <div style="
            position:absolute;
            bottom:15px;
            right:25px;
            background:#fef3c7;
            color:#92400e;
            border:2px solid #f59e0b;
            padding:8px 20px;
            border-radius:20px;
            font-size:17px;
            font-weight:bold;
          ">PAYMENT PENDING</div>
        `
        : ""
    }

   

  </div>
`;

      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      const availableWidth = pageWidth - margin * 2;
      const availableHeight = pageHeight - margin * 2;

      const ratio = Math.min(
        availableWidth / canvas.width,
        availableHeight / canvas.height
      );

      const imgWidth = canvas.width * ratio;
      const imgHeight = canvas.height * ratio;

      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      if (index > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        "JPEG",
        x,
        y,
        imgWidth,
        imgHeight
      );

      document.body.removeChild(tempDiv);
    }

    pdf.save(
      teamName
        ? `${teamName}.pdf`
        : "Nileshwar Premier League Season 11.pdf"
    );

  } catch (error) {
    console.error("PDF generation error:", error);
  } finally {
    setIsLoading(false);
  }
};

 
  return (
    <div>
      {/* <button onClick={generatePDF}>Generate PDF</button> */}

       {isLoading && (

       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
  <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 flex flex-col items-center text-center">

    {/* Spinner */}
    <div className="relative">
      <div className="w-16 h-16 border-4 border-yellow-400/30 rounded-full"></div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    {/* Message */}
    <h3 className="mt-5 text-lg sm:text-xl font-bold text-gray-800">
      Downloading File
    </h3>

    <p className="mt-2 text-sm sm:text-base text-gray-600">
      Please stay on this page while your file is being prepared.
    </p>

    {/* Animated Dots */}
    <div className="flex gap-2 mt-5">
      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"></span>
      <span
        className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.15s" }}
      ></span>
      <span
        className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce"
        style={{ animationDelay: "0.3s" }}
      ></span>
    </div>

  </div>
</div>

)}

      <Button
  onClick={generatePDF}
  className="w-full sm:w-auto h-10 sm:h-12 px-4 sm:px-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-gold flex items-center justify-center"
>
  <Download className="h-5 w-5" />
</Button>


    </div>
  );



};

const playerListContainer: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(23rem, 1fr))',
    gap: '2rem',
    // maxWidth: '120rem',
    margin: '0 auto',
    padding: '2rem',
    backgroundColor:'white'
}

const cardIconTextStyle: React.CSSProperties = {
    padding: '10px',
    cursor: 'pointer',
    color: 'yellow',
    textAlign: 'left',
    fontSize: '50px',
    textShadow: "1px 1px 0 #f00, 2px 2px 0 #f00, 3px 3px 0 #f00",
    fontWeight:"bolder",
    fontStyle:'italic'
  };

const cardSubHeader : React.CSSProperties = {
    fontSize: '25px',
    fontFamily: 'auto',
    marginTop: '11px',
    // textAlign: 'center',
    border: "2px solid #ccc",
    borderRadius: "8px",
    // width: "130px",
    backgroundColor: "antiquewhite",
    color : "black",
    padding:"3px",
    marginLeft:"125px",
    height:"fit-content"
}


const cardHeaderTextStyle: React.CSSProperties = {
    gap: '2rem',
    cursor: 'pointer',
    // color: 'yellow',
    textAlign: 'center',
    fontSize: '23px',
    // textShadow: '1px 1px 0 #999, 2px 2px 0 #999, 3px 3px 0 #999',
    fontFamily: "Arial,Helvetica, sans-serif",
    justifyContent:'center'
    
  };

  const cardBodyTextStyle: React.CSSProperties = {
    color: 'black',
    textAlign: 'left',
    fontSize: '25px',
    paddingLeft:"10px"
  };

const n05IconStyle : React.CSSProperties = {
    display:'flex', justifyContent:'end', marginLeft:"95px"
}

const imageStyle1 : React.CSSProperties = {
    height : '7rem',
    width: '7rem',
    padding:'5px',
    // borderRadius: '13px',
    // objectFit: 'cover',
    // border: 'none'
    // marginLeft:"-15px",
    // marginTop:"-122px"
}

const spanText :  React.CSSProperties = {
    marginTop: '-126px', 
    fontWeight: 'bold', 
    fontSize: '16px',
    paddingLeft : '87px',
    color:'white'
    // paddingTop : '8px'
}

const spanText1 :  React.CSSProperties = {
    marginTop: '4px', 
    fontWeight: 'bold', 
    fontSize: '16px',
    paddingLeft : '88px',
    color : 'white'
    // paddingTop : '8px'
}

const fullNameText :  React.CSSProperties = {
    marginTop: '-149px', 
    fontWeight: 'bold', 
    fontSize: '14px',
    paddingLeft : '85px',
    color:"white"
}

const idText :  React.CSSProperties = {
    marginTop: '-193px', 
    fontWeight: 'bold', 
    fontSize: '21px',
    paddingLeft : '26px',
    color:"white"
}

const svgStyle :React.CSSProperties = {
    height : '1rem',
    width: '1rem',
    objectFit:'cover',
    padding:'10px',
    filter: 'invert(85%) sepia(20%) saturate(150%) hue-rotate(200deg) brightness(120%) contrast(120%)'

}

const profileImageStyle : React.CSSProperties = {
    height: '11.5rem',
    width: '6.5rem',
    // padding: '5px',
    alignItems: 'flex-start',
    // display: 'grid',
    marginLeft: '216px',
    objectFit:'cover',
    // borderRadius : "50%"
    marginTop:"289px",
    borderImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 10%)",
//   WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,2) 10%)",
//   maskImage: "linear-gradient(to top, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 20%)"
  
}

const players__card__wrap :  React.CSSProperties = {
    gap: '2rem',
    // backgroundImage: 'linear-gradient(to top,  #DE3163	, #000080	)',
    // backgroundImage :"linear-gradient(#194564,#4c8dba, #194564)",
    backgroundImage : `url(${playerBg})`,
    border: '1px solid #ccc', 
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
    borderRadius: '8px', 
    margin: '0 auto',
    marginTop:'25px',
    // backgroundColor:"#d4af37"
    width:"351px",
    height:"497px",
    // overflow: 'hidden'
  }

const no5Style : React.CSSProperties = {
    height : "3rem",
    width : "4rem",
    // borderRadius : "50%",
    padding:"5px",
    marginLeft:"15px",
    marginTop:"-35px"

}

const cardHeader :  React.CSSProperties = {
    display: 'flex',
    justifyContent:'flex-start'
}

const cardFooter :  React.CSSProperties = {
    display: 'flex',
    backgroundColor : 'purple',
    marginBottom:'10px'
}

const playerCountStyle : React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor:'#d4af37'
}

const inputContainerStyle: React.CSSProperties = {
    flexBasis: "48%",
    height: "2rem",
    border: "2px solid #ccc",
    borderRadius: "8px",
    margin:'5px',
    // width : '80%'
  };

const cardTitleStyle : React.CSSProperties = {
    fontSize: '30px',
    fontFamily: 'auto',
    marginTop:'8px',
    textAlign: 'center',
    background: "linear-gradient(to top, #f32170, #ff6b08,#cf23cf, #eedd44)",
    WebkitTextFillColor: "transparent",
    WebkitBackgroundClip: "text",
    marginLeft:"10px"
    
}

const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
        playerCountStyle.fontSize = '12px'; // Adjust font size for mobile view
        playerCountStyle.padding = '10px'

        playerListContainer.gridTemplateColumns =  'repeat(auto-fit, minmax(18rem, 1fr))'
        playerListContainer.padding =  '0rem'

        players__card__wrap.margin = '10px'

        cardIconTextStyle.fontSize = "35px"
        cardIconTextStyle.marginTop = "15px";

        cardSubHeader.fontSize = '20px';
        cardTitleStyle.fontSize = '26px';

        spanText.paddingLeft = '5px';
        n05IconStyle.marginLeft = '80px'
        no5Style.marginTop = '5px'

    }


export default PDFCreator;
