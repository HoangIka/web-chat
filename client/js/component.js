export const add_panel_str = `<div class="add-panel">
      <section>
        <div title>...</div>
        <button class="close-add-panel"><span class="material-symbols-outlined">close</span></button>
      </section>
      <section>
        <input class="find-search" type="search" placeholder="Tìm Kiếm:">
        <button class="find-btn"><span class="material-symbols-outlined">search</span></button>
      </section>
      <section add-chat-list>
        
      </section>
    </div>`;

export const friend_str = `<div class="friend-profile">
          <section>
            <img class="friend-icon" src="assets/default.png">
            <div class="friend-name">Tên</div>
          </section>
          <section>
            <button class="add-friend"><div class="material-symbols-outlined">add</div></button>
          </section>
        </div>`;

export const group_str = `<div class="group">
        <section>
        <img class="group-icon" src="assets/default.png">
        <div class="group-name">Tên nhóm</div>
        <button class="add-group"><div class="material-symbols-outlined">add</div></button>
        </section>
        <section>
        <!-- <div class="member-count">N/A Thành Viên</div> -->
        </section>
    </div>`;

export const chat_nav_str = `<div class="chat-nav" data-chat-id>
          <img class="profile" src="assets/default.png">
          <div>
            <div class="chat-name">Tên</div>
            <div style="display: none;" class="chat-message seened-message">............</div>
          </div>
          <div>
            <button class="more-setting" style="display: none;"><span class="material-symbols-outlined">more_horiz</span></button>
          </div>
        </div>`;
export const other_message_str = `<div class="type-message" other>
          <div class="profile-section">
            <img class="profile-icon" src="assets/default.png">
            <div class="profile-name">Tên A</div>
            <button class="setting-user"><span class="material-symbols-outlined">more_horiz</span></button>
          </div>
          <span class="message" other>xin chào!</span>
          <div class="is-sented" other>16:00</div>
        </div>`;
export const self_message_str = `<div class="type-message" self>
          <div class="profile-section" self>
            <button class="setting-user"><span class="material-symbols-outlined">more_horiz</span></button>
            <div class="profile-name" self>Tên B</div>
            <img class="profile-icon" self src="assets/default.png">
          </div>
          <div class="message" self>xjn chào👋</div>
          <div class="is-sented" self>16:01</div>
        </div>`;
export const is_typing_str = `<div class="is-typing">
          <div class="typing-dot dot1"></div>
          <div class="typing-dot dot2"></div>
          <div class="typing-dot dot3"></div>
        </div>`;
// <div class="time-stamp">2024/6/3 - 16:00</div>

// <div class="profile-join">
//   <img class="profile-joiner" src="assets/default.png">
//   <div class="join-message">
//     "Tên A" lần đầu tiên tham gia vào phòng, hãy chào thành viên mới!
//   </div>
// </div>


// <div class="system-notifi">
//   "Tên B" đã online
// </div>