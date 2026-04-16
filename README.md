# HeavenHub

HeavenHub is a premium vacation rental platform I built for tourists who are looking for curated and verified luxury stays across over 35 Indian cities. 

I designed it with transparency in mind. The interface simplifies finding the perfect getaway for solo travelers, families, and professionals alike, with heavily vetted and featured properties.

## Live Demo

You can try out the live version of HeavenHub here: [HeavenHub Live](https://heavenhub-production.up.railway.app)
*(Note: update this link if the deployment URL changes)*

## Key Features

- **Smart Recommendations Engine**: A matcher that filters properties based on your travel party size, preferred vibe, and optimal budget tier.
- **Transparent Pricing**: Showing standard rates, cleaning fees, and service charges upfront before you commit to anything.
- **Verified Properties**: Quality control is important, so all properties have vetted photos, amenities, and host credentials.
- **Interactive Map Search**: You can browse curated stays across regions like the coastal South or the mountainous North using an interactive map.
- **Full Booking & Payment System**: A seamless flow to browse, check dates, book, and secure payments for your favorite property.
- **Host Dashboard**: A dedicated portal for property owners to track listings and manage reservations.
- **Real-Time Messages (Inbox)**: An integrated messaging system so guests can stay in touch with their hosts.
- **Responsive & Premium UI**: Built with vivid aesthetics and a polished high-end design pattern fit for mobile and desktop. 

## Screenshots

*(Note: Replace the images below with actual screenshots of your application)*

### Homepage & Smart Recommendations
![Homepage & Smart Recommendations](./screenshots/homepage.png)

### Search & Interactive Filters
![Properties Search](./screenshots/search.png)

### Property Details
![Property View](./screenshots/property.png)

### Secure Booking Flow
![Booking Summary](./screenshots/booking.png)

## Tech Stack

Here are the core technologies used in the project:
- **Frontend**: React (Vite), TailwindCSS, React Router
- **Backend**: Java, Spring Boot, Spring Data JPA
- **Database**: PostgreSQL (MySQL works too, depending on your configuration)
- **Deployment**: Railway / Vercel 

## How To Run Locally

If you'd like to get this running on your own machine, follow these steps:

1. Clone the repository.
2. Start the backend server:
   - Navigate to the `heavenhub` directory.
   - Set up your database credentials in `application.properties`.
   - Run the application via Maven: `./mvnw spring-boot:run`
3. Start the frontend application:
   - Navigate to the `frontend` directory.
   - Install the dependencies by running: `npm install`
   - Start the Vite dev server: `npm run dev`
4. Access the platform in your browser at http://localhost:5173 
