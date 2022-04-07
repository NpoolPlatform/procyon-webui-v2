<template>
  <div class='back-button'>
    ⭠
  </div>
  <div class='content'>
    <h2>Contact Procyon Support</h2>
  </div>
  <div class='content contact-page'>
    <div class='form-container'>
      <h3 class='form-title'>Contact Procyon via Email</h3>
      <form action=''>
        <label for='email'>E-mail Address</label>
        <input type='email' id='email' required>
        <label for='name'>Name</label>
        <input type='text' id='name' name='name' required>
        <label for='subject'>Subject</label>
        <input type='text' id='subject' name='subject' required>
        <label for='message'>Message</label>
        <textarea type='text' id='message' name='message' required />
        <input type='submit' value='Send Message' class='register'>
      </form>
    </div>
    <div class='form-container'>
      <h3 class='form-title'>Contact Procyon via LINE</h3>
      <p class='qr-code-text'>To scan the QR code below, open <strong>LINE</strong> on your phone and tap the <strong>'Add Friends'</strong> icon. Then select <strong>'QR code'</strong> at the top.</p>
      <div class='qr-code-container'>
        <img src='line-qr.png'>
      </div>
      <p class='qr-code-text'>Feel free to contact us with questions about our platform, support issues, or just to say hi. We look forward to hearing from you!</p>
      <h4 id='signature'>—Procyon Support Team</h4>
    </div>
  </div>
</template>
