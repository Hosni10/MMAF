export const emailTemplate = ({ link, linkData, subject }) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
        <style>
            body {
                margin: 0;
                font-family: Arial, sans-serif;
                background: linear-gradient(to right, #4A00E0, #8E2DE2);
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
                background: linear-gradient(to right, #4A00E0, #8E2DE2);
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
                color: #4A00E0;
                margin-bottom: 20px;
            }
            .button {
                display: inline-block;
                padding: 12px 25px;
                background: linear-gradient(to right, #4A00E0, #8E2DE2);
                color: white !important;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                font-weight: bold;
            }
            .footer {
                padding: 20px;
                text-align: center;
                color: #777;
                font-size: 14px;
                background-color: #f0f0f0;
            }
            a {
                color: #4A00E0;
            }
            .button:hover {
                opacity: 0.9;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <img src="https://ik.imagekit.io/xztnqpqpz/Roomo/logo/logo%20(1).png?updatedAt=1745707289253" alt="Logo"/>
                <div><a href="https://roomo.ai" target="_blank" style="color:white; text-decoration: underline;">View In Website</a></div>
            </div>
            <div class="content">
                <h1>${subject}</h1>
                <p>Click the button below to continue:</p>
                <a href="${link}" class="button">${linkData}</a>
            </div>
            <div class="footer">
                Stay in touch<br/>
                &copy; ${new Date().getFullYear()} AI Home Designs
            </div>
        </div>
    </body>
    </html>`
}
