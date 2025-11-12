export const emailTemplate = ({ link, linkData, subject }) => {
return `<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(to right, #000000, #C20000);
        }
        .email-container {
            width: 60%;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(to right, #000000, #C20000);
            padding: 20px;
            text-align: center;
            color: white;
        }
        .header img {
            max-height: 60px;
            margin-bottom: 10px;
        }
        .content {
            padding: 30px;
            text-align: center;
        }
        .content h1 {
            color: #C20000;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 12px 25px;
            background: linear-gradient(to right, #000000, #C20000);
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 20px;
            font-weight: bold;
            transition: all 0.3s ease;
        }
        .button:hover {
            opacity: 0.9;
        }
        .footer {
            padding: 20px;
            text-align: center;
            color: #555;
            font-size: 14px;
            background-color: #f7f7f7;
            border-top: 2px solid #C20000;
        }
        a {
            color: #C20000;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://ik.imagekit.io/lkz5sclds/UAE_MMAF/User/logo/favicon.png?updatedAt=1762940843899" alt="Logo"/>
                <div><a href="https://sport-dashboard-pi.vercel.app/" target="_blank" style="color:white; text-decoration: underline;">View In Website</a></div>
        </div>
        <div class="content">
            <h1>${subject}</h1>
            <p>Click the button below to continue:</p>
            <a href="${link}" class="button">${linkData}</a>
        </div>
        <div class="footer">
            Stay in touch<br/>
            &copy; ${new Date().getFullYear()} Sport Dashboard. All rights reserved.
        </div>
    </div>
</body>
</html>`;

}
