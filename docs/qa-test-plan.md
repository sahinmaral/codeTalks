# Manual QA test plan

A checklist to walk through on a real device/simulator before each release. Complements the automated test suite (`yarn test`), which covers pure logic (schemas, reducers, error-handling utils) — this covers real device/UX behavior that's expensive or impossible to automate today (push notifications, real-time messaging, native permissions).

## Auth

- [ ] Login with correct credentials succeeds and lands on the channel list.
- [ ] Login with a wrong password shows a clear error, does not log in.
- [ ] Login with a non-existent account shows a clear error.
- [ ] Sign up → continue sign-up completes successfully and lands on the channel list.
- [ ] Continue sign-up rejects an empty first or last name with a clear message.
- [ ] Logout completes and returns to the login screen even if push-token removal fails (e.g. airplane mode enabled right before tapping logout).

## Channels

- [ ] Create a new channel with name + description; it appears in "Active Channels".
- [ ] Join a channel from "All Channels"; it then appears in "Active Channels".
- [ ] Leave a channel; it disappears from "Active Channels".
- [ ] Mute a channel; unread notifications for it stop arriving. Unmute restores them.
- [ ] "All Channels" vs "Active Channels" tabs show the correct, distinct sets.
- [ ] Pending join requests: an admin can approve/reject a request.
- [ ] Remove/ban a member: available to an admin/owner, not available (or hidden) for a regular member.

## Messaging

- [ ] Send a message; it appears in real time on a second session/device in the same channel.
- [ ] Receiving a message in a channel you're not currently viewing increments its unread badge and the total unread count.
- [ ] Opening a channel resets its unread badge to 0.
- [ ] Background the app mid-conversation, then foreground it — messages sent while backgrounded arrive (SignalR reconnects).

## Profile

- [ ] Edit profile: leading/trailing whitespace in first/last name is trimmed; over-length values are rejected.
- [ ] Change password: a weak new password is rejected with a clear message.
- [ ] Change password: reusing the current password as the new one is rejected.
- [ ] Change password: valid change succeeds and can be used to log in again.
- [ ] Avatar upload: a normal photo works; an unsupported file type is rejected; denying gallery permission shows a sensible message instead of crashing.

## Push notifications

- [ ] First launch prompts for notification permission.
- [ ] Denying permission doesn't crash the app; the app still functions without push.
- [ ] Tapping a notification while the app is killed opens directly to the right channel.
- [ ] Tapping a notification while the app is backgrounded/foregrounded navigates to the right channel.
- [ ] After logout and re-login on the same device, notifications still arrive (device re-registered).

## Connectivity

- [ ] Enable airplane mode mid-session: the "no internet" screen appears; disabling it returns to normal use.
- [ ] Let an access token expire (or force a 401): the app silently refreshes and retries, no visible interruption.
- [ ] Simulate a slow/throttled network on a request: after ~15s it surfaces a user-facing error instead of hanging indefinitely.
- [ ] Force a crash (temporary debug trigger): the "Something went wrong" fallback screen appears instead of a blank/frozen screen, "Try Again" recovers where possible, and the event shows up in the Sentry dashboard.

## Localization

- [ ] Switch language from English to Turkish mid-session; all visible text updates immediately.
- [ ] The language choice persists after fully restarting the app.
- [ ] A known server error message (e.g. "already a member of this channel") renders correctly translated in both languages.

## Theming

- [ ] Light, dark, and system modes all render correctly with no unstyled/invisible elements.
- [ ] In system mode, toggling the OS-level dark mode while the app is open updates the UI live.
- [ ] Theme choice persists after fully restarting the app.
