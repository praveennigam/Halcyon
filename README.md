# Halcyon

Halcyon is a small appointment desk. A visitor picks Consultation, Demo, or Support, chooses a day, and takes an open 30-minute slot between 10:00 AM and 6:00 PM IST. One service cannot give the same time to two people.

There is no login. The email typed at booking is saved in the browser, and the Appointments page shows only the visits booked with that email.

This is a MERN app:

- **MongoDB** stores the appointments. It runs locally on port 27017, database `halcyon`.
- **Express** is the API on port 4000.
- **React** draws the screens on port 3000. Vite runs the dev server. React Router picks the page.
- **Node** runs both sides.

## Features

- Three services: Consultation, Demo, and Support.
- Sixteen slots a day, 30 minutes each, from 10:00 to 17:30. The last visit ends at 18:00.
- Past days and slots that have already started are closed.
- A day that is full says so, and asks for another date.
- Name, email, and a 10-digit Indian mobile number are checked in the browser and again on the API.
- After a booking, the screen shows the reference. The slot list updates.
- Appointments can be cancelled. The cancelled row stays, marked cancelled, and that time opens again.
- The visitor only sees their own visits. All visits is the desk list: search, filter, sort, and pages.
- Book, Appointments, and All visits each show a short clock spinner when the page first opens. The label matches the tab.

## How a booking works

1. `BookPage` renders `BookingFlow`. That loads the three services from `GET /api/services`.
2. The visitor picks a service, then a date. `useSlots` calls `GET /api/slots` and marks each time open, booked, or past.
3. They enter name, email, and phone. `validate.js` checks the form before it is sent. The API checks the same rules in `validation/booking.js`.
4. `POST /api/appointments` saves the visit and returns it. The browser stores the email under `halcyon.email`.
5. `ConfirmationPanel` shows the reference, service, date, and time.

Cancelling calls `POST /api/appointments/:id/cancel` with that same email. The status becomes `cancelled`. The unique slot index ignores cancelled rows, so the time can be booked again.

The booking form has three steps: service, time, details. Changing step does not jump the page. After a successful book, the page scrolls to the confirmation.

## Screens

`client/src/main.jsx` mounts `App`. `App` wraps the router in `Providers`, which owns the toasts. `AppShell` is the shared frame: header, the current page, and footer. `<Outlet />` is the spot that changes when the URL changes.

| URL | Page file | What it draws |
| --- | --- | --- |
| `/` | `pages/BookPage.jsx` | `BookingFlow` |
| `/appointments` | `pages/AppointmentsPage.jsx` | `AppointmentsBoard` |
| `/admin/list` | `pages/AllVisitsPage.jsx` | `AdminList` |
| anything else | `pages/MissingPage.jsx` | "That page is not here" |

Each page only sets `document.title` and renders one component. The page files stay thin on purpose.

The header shows Halcyon and "Appointment desk" on every width. On a wide screen it shows Book, Appointments, and All visits as links. On a narrow screen those links sit behind the three-line button, which turns into an X while the menu is open.

Opening a tab holds the clock spinner for about a second, then the page fades in. Changing a filter, a search, or a page does not show that spinner again. Refresh on the appointments list uses its own small spinner and waits at least two seconds.

If this browser has no saved email, Appointments asks for the one used at booking. "Use a different email" switches it. All visits does not ask for an email.

## Client files

```
client/index.html                      the page Vite serves
client/src/main.jsx                    starts React
client/src/App.jsx                     routes
client/src/index.css                   Tailwind and the page styles
client/src/api.js                      fetch helpers for the API
client/src/format.js                   dates, times, and phone for the screen
client/src/validate.js                 name, email, and mobile checks
client/src/hooks/useSlots.js           loads slots for one service and date
client/src/hooks/useSavedEmail.js      reads and writes the booking email
```

`api.js`, `format.js`, and `validate.js` are plain functions. They do not return markup, so they stay `.js`. Files that return screen markup are `.jsx`. The two hooks return data, not markup, so they are `.js` as well.

Booking pieces:

- `BookingFlow` holds the step, the chosen service, the date, the slot, and the customer.
- `ServiceStep` and `ServiceOption` are the first step.
- `ScheduleStep` and `SlotButton` are the time step. `SlotSkeleton` shows while slots load.
- `DetailsStep` and `Field` are the name, email, and phone step.
- `SelectionSummary` and `BookingRecap` show what has been chosen so far.
- `StepPills` and `StepHeading` are the step labels.
- `ConfirmationPanel` is the screen after a successful book.

Appointment pieces:

- `AppointmentsBoard` loads the visits for the saved email and splits them into upcoming and closed.
- `EmailLookup` is the form shown when no email is saved yet.
- `AppointmentCard` is one visit. `StatusPill` is Confirmed or Cancelled.
- `CancelDialog` asks "Cancel this appointment?" The buttons are "Keep it" and "Cancel appointment".

Desk list pieces:

- `AdminList` loads `GET /api/admin/list`.
- `AdminFilters` is the search box, service chips, and status chips.
- `AdminRows` is the table on a wide screen and the stacked cards on a narrow one.

Shared pieces:

- `SiteHeader` and `SiteFooter` live in `AppShell`.
- `Providers` shows toasts. A toast is a small white card with a coloured dot.
- `Spinner` is the clock on a fresh page, and the small circle used inside buttons.
- `Notice` is the error and empty-state message.

`api.js` calls `http://localhost:4000/api` unless `VITE_API_URL` is set. A failed fetch becomes "We could not reach the booking service."

## Server files

A request comes in through `server/src/index.js`. That file loads `.env`, allows the React origin, parses JSON, mounts `/api`, and connects MongoDB. Controllers read the request and send JSON. Services do the work. Validation rejects a bad body before that work runs.

```
server/src/index.js                    starts Express and connects MongoDB
server/src/db.js                       mongoose connect
server/src/routes/index.js             URL to controller
server/src/middleware/errorHandler.js  turns a thrown error into JSON
server/src/controllers/               appointment, slot, and service controllers
server/src/services/appointments.js    book, list, get one, cancel
server/src/services/availability.js    mark the day's slots open, booked, or past
server/src/models/Appointment.js       the MongoDB document and the slot index
server/src/data/services.js            Consultation, Demo, Support
server/src/validation/booking.js       checks the booking body
server/src/validation/queries.js       checks list, slot, and admin queries
server/src/utils/time.js               IST clock, slot list, past-slot rules
server/src/utils/reference.js          builds the HL- reference
server/src/utils/httpError.js          status, message, and code
server/src/utils/asyncHandler.js       forwards a rejected promise to the error handler
```

Services are not stored in MongoDB. They live in `data/services.js`.

`appointments.js` is the booking path. It checks the body, refuses a past slot, looks for an existing confirmed booking, then inserts. If two requests pass that look-up together, the unique index still lets only one insert. The other gets `409` and code `SLOT_TAKEN`.

A new reference looks like `HL-` plus six characters. If that reference is already used, the insert is tried again with a new one. That clash is not a taken slot.

## API

Every path below is under `http://localhost:4000`. Errors are JSON: `{ error, code }`. A bad form also returns `fields`.

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/health` | `{ ok: true }` |
| GET | `/api/services` | The three services |
| GET | `/api/slots?serviceId=&date=` | Slots for that service and day, plus a message if the day is closed or full |
| POST | `/api/appointments` | Creates a visit. Body: `serviceId`, `date`, `startTime`, `customerName`, `email`, `phone`. Returns `{ appointment }` |
| GET | `/api/appointments?email=` | Visits for that email. Email is required |
| GET | `/api/appointments/:id?email=` | One visit, only if the email matches |
| POST | `/api/appointments/:id/cancel` | Body: `{ email }`. Sets status to cancelled |
| GET | `/api/admin/list` | Every visit. Optional `serviceId`, `status`, `date`, `email`, `q`, `page`, `limit`, `sort`, `order` |

`q` searches name, email, reference, and phone. `page` starts at 1. `limit` defaults to 10 and stops at 50. Sort can be `date`, `startTime`, `createdAt`, `customerName`, `reference`, `status`, or `email`. The default is newest first.

A missing email on the visitor list is `400`. A cancel or details call with the wrong email is `404`, so one person cannot open another person's visit by guessing the id.

## How a double booking is stopped

The desk checks whether a slot is free, then inserts the appointment. Two people can pass that check at the same moment, so the check is not the real lock.

Confirmed appointments have a unique index on `serviceId`, `date`, and `startTime`. MongoDB accepts one insert and rejects the other with duplicate-key error `11000`. `insertOnce` in `appointments.js` turns that into `409` and `SLOT_TAKEN`.

Cancelled appointments stay in the collection for the list, but they drop out of that index, so the time can be booked again.

The same clock time can be booked for two different services. It cannot be used twice for one service.

## Rules

- Timezone is Asia/Kolkata.
- Hours are 10:00 to 18:00, in 30-minute steps. The last start is 17:30.
- A past day, or a slot that has already started, cannot be booked.
- Booking is open for 60 days, including today.
- A name may use letters, spaces, a period, an apostrophe, or a hyphen.
- A mobile number is 10 digits and starts with 6, 7, 8, or 9.
- The appointments page lists only the visits booked with one email. The API requires that email on the list, the details, and cancel.

## Run it

You need Node.js 18 or newer, and MongoDB listening on `127.0.0.1:27017`.

API, from `server/`:

```bash
npm install
npm start
```

`server/.env` sets the port, the database, and the React origin:

```
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/halcyon
CLIENT_ORIGIN=http://localhost:3000
```

`npm run dev` uses nodemon and restarts the API when a server file changes. If that watcher reports "too many open files", use `npm start`.

Web, from `client/`:

```bash
npm install
npm run dev
```

Open http://localhost:3000. `client/.env` sets `VITE_API_URL=http://localhost:4000/api`. If that line is missing, the app still calls the same address.

## Handy URLs

- Book: http://localhost:3000
- Appointments: http://localhost:3000/appointments
- All visits: http://localhost:3000/admin/list
- Health: http://localhost:4000/api/health
