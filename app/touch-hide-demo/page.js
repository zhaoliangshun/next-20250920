'use client';

import TouchSensitiveHide from '../../components/TouchSensitiveHide';

export default function TouchHideDemo() {
  return (
    <div >
      <h1>Touch Sensitive Hide Demo</h1>
      <p>This element will slide down after 3 seconds. Touch anywhere on the screen to make it reappear.</p>
      
      <TouchSensitiveHide>
        <div>
          <h2>Touch Me!</h2>
          <p>I'll hide in 3 seconds, but will come back when you touch the screen.</p>
        </div>
      </TouchSensitiveHide>
      
      <div>
        <h3>How it works:</h3>
        <ul>
          <li>Wait 3 seconds and the box above will slide down and hide</li>
          <li>Touch anywhere on the screen to make it reappear</li>
          <li>It will hide again after 3 seconds of inactivity</li>
        </ul>
      </div>
    </div>
  );
}
