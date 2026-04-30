# Sendasta Marketing & Tracking Guide

## 1. Product Hunt Launch Strategy
- **Prep:** Have a high-quality animated GIF thumbnail showing a wrong email being blocked.
- **Timing:** Launch exactly at 12:01 AM PST to get a full 24 hours on the homepage.
- **Messaging:** Focus on the pain ("Stop sending emails to the wrong person"). Your tagline should be punchy.
- **First Comment:** Write a short "Maker Comment" explaining the origin story (e.g., watching a colleague send a confidential doc to a competitor).
- **Traffic:** Do not ask for direct upvotes! Share the link to the *Product Hunt homepage* and ask for feedback.
- **Landing Page:** Make sure your "Download XML / Install Free" button is the very first thing people see when they click through to sendasta.com.

## 2. B2B Distribution (The Side-loading Secret)
You don't need the Microsoft AppSource store right away.
- Enterprise IT Admins can easily deploy custom Add-ins via the **Microsoft 365 Admin Center**.
- Go to Settings > Integrated Apps > Upload custom apps -> Paste the Sendasta XML link.
- Target niches where leaks are catastrophic (Law Firms, M&A Advisors, Healthcare, Accounting).

## 3. How to Setup Google Sheets Tracking (100% Free)

We updated the Sendasta codebase to track `companyDomain`, `senderEmail`, and `recipientEmails` securely without needing an anonymous ID. To send this data to Google Sheets:

### Step 1: Set up the Google Sheet
1. Create a new Google Sheet named "Sendasta Logs".
2. In Row 1, add these headers: `Timestamp`, `Action`, `Company Domain`, `Sender Email`, `Recipients`, `Reason`.

### Step 2: Add the Webhook Script
1. In the Google Sheet, click **Extensions > Apps Script**.
2. Delete the default code and paste this:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    const recipients = Array.isArray(data.recipientEmails) 
      ? data.recipientEmails.join(", ") 
      : (data.recipientEmails || "");
    
    sheet.appendRow([
      data.at || new Date().toISOString(),
      data.action || "",
      data.companyDomain || "",
      data.senderEmail || "",
      recipients,
      data.reason || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ "status": "success" }))
                         .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "error": error.message }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Get your Webhook URL
1. Click the blue **Deploy** button > **New deployment**.
2. Select type: **Web app**.
3. Settings:
   - Description: `Sendasta Webhook`
   - Execute as: `Me`
   - Who has access: `Anyone` *(Crucial!)*
4. Click **Deploy**, authorize the script (click Advanced -> Go to script), and copy the **Web app URL**.

### Step 4: Paste it into Vercel
1. Go to your Vercel Dashboard for Sendasta.
2. Go to **Settings > Environment Variables**.
3. Create a new variable:
   - Key: `GOOGLE_SHEETS_WEBHOOK_URL`
   - Value: `[paste the Web app URL]`
4. Save and **Redeploy** your project.
