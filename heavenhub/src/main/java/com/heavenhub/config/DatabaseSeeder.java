package com.heavenhub.config;

import com.heavenhub.models.Property;
import com.heavenhub.models.Role;
import com.heavenhub.models.TrustScore;
import com.heavenhub.models.User;
import com.heavenhub.repositories.PropertyRepository;
import com.heavenhub.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeds demo users once; seeds Indian listings whenever the properties table is empty
 * (truncate {@code properties} to re-import without wiping users).
 */
@Component
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    private record SeedStay(
            String city,
            String state,
            String region,
            BigDecimal pricePerNight,
            BigDecimal cleaningFee,
            BigDecimal averageRating,
            BigDecimal platformFeePercent,
            int maxGuests,
            String titleRoot,
            String propertyType,
            int bedrooms,
            int bathrooms,
            boolean instantBook,
            boolean petFriendly,
            boolean superhost,
            int reviewCount,
            BigDecimal latitude,
            BigDecimal longitude,
            String amenities
    ) {}

    /** 35 destinations — budget hostels to luxury villas, ratings 3.9–5.0 */
    private static final List<SeedStay> STAYS = List.of(
            new SeedStay("Mumbai", "Maharashtra", "West", bd("8900"), bd("1400"), bd("4.52"), bd("12"), 5,
                    "Harbour light penthouse", "City penthouse", 3, 3, true, false, true, 214,
                    bd("19.0760"), bd("72.8777"),
                    "WiFi, AC, Sea view, Modular kitchen, Power backup, Elevator, Concierge"),
            new SeedStay("Delhi", "Delhi", "North", bd("7200"), bd("1100"), bd("4.41"), bd("11"), 4,
                    "Lutyens lane studio", "Studio loft", 1, 2, true, true, false, 156,
                    bd("28.6139"), bd("77.2090"),
                    "WiFi, AC, Kitchenette, Metro 6 min, Inverter, Workspace"),
            new SeedStay("Bengaluru", "Karnataka", "South", bd("5100"), bd("950"), bd("4.68"), bd("12"), 4,
                    "Tech-park pause", "Garden villa", 2, 2, true, false, true, 302,
                    bd("12.9716"), bd("77.5946"),
                    "WiFi, AC, Parking, WFH desk, Filter coffee kit, Power backup"),
            new SeedStay("Hyderabad", "Telangana", "South", bd("4200"), bd("820"), bd("4.35"), bd("11"), 3,
                    "Charminar breeze flat", "Heritage apartment", 2, 2, false, false, false, 88,
                    bd("17.3850"), bd("78.4867"),
                    "WiFi, AC, Balcony, Geyser, Street parking"),
            new SeedStay("Chennai", "Tamil Nadu", "South", bd("6800"), bd("1250"), bd("4.72"), bd("13"), 6,
                    "Marina salt suite", "Sea-view apartment", 3, 3, true, true, true, 267,
                    bd("13.0827"), bd("80.2707"),
                    "WiFi, AC, Beach access path, Kitchen, Washing machine, CCTV"),
            new SeedStay("Kolkata", "West Bengal", "East", bd("5400"), bd("980"), bd("4.58"), bd("12"), 5,
                    "Colonial courtyard", "Heritage haveli", 4, 3, false, false, false, 142,
                    bd("22.5726"), bd("88.3639"),
                    "WiFi, AC, Courtyard, Bengali breakfast opt-in, Car parking"),
            new SeedStay("Pune", "Maharashtra", "West", bd("3800"), bd("750"), bd("4.44"), bd("11"), 4,
                    "Monsoon balcony", "Urban loft", 2, 2, true, false, false, 173,
                    bd("18.5204"), bd("73.8567"),
                    "WiFi, AC, Balcony plants, Tea station, Bike storage"),
            new SeedStay("Ahmedabad", "Gujarat", "West", bd("4400"), bd("800"), bd("4.81"), bd("12"), 5,
                    "Pol house calm", "Heritage townhouse", 3, 2, false, true, true, 198,
                    bd("23.0225"), bd("72.5714"),
                    "WiFi, AC, Courtyard seating, Pure veg kitchen, Parking"),
            new SeedStay("Jaipur", "Rajasthan", "North", bd("6200"), bd("1200"), bd("4.63"), bd("10"), 3,
                    "Pink city pad", "Rooftop haveli", 2, 2, true, false, true, 421,
                    bd("26.9124"), bd("75.7873"),
                    "WiFi, AC, Jharokha view, Traditional sit-out, Airport pickup opt"),
            new SeedStay("Surat", "Gujarat", "West", bd("3900"), bd("700"), bd("4.29"), bd("12"), 4,
                    "Diamond district nest", "Service apartment", 2, 2, true, false, false, 64,
                    bd("21.1702"), bd("72.8311"),
                    "WiFi, AC, Kitchen, Geyser, Covered parking"),
            new SeedStay("Lucknow", "Uttar Pradesh", "North", bd("2800"), bd("620"), bd("4.51"), bd("11"), 3,
                    "Kebab lane flat", "Nawabi apartment", 2, 2, false, false, false, 91,
                    bd("26.8467"), bd("80.9462"),
                    "WiFi, AC, Chikankari decor, Home chef on request"),
            new SeedStay("Kanpur", "Uttar Pradesh", "North", bd("2200"), bd("500"), bd("3.95"), bd("10"), 3,
                    "Ganges breeze room", "Compact studio", 1, 1, false, false, false, 34,
                    bd("26.4499"), bd("80.3319"),
                    "WiFi, Fan, Cooler, Hot water, Street parking"),
            new SeedStay("Nagpur", "Maharashtra", "Central", bd("4600"), bd("780"), bd("4.47"), bd("12"), 5,
                    "Orange city loft", "Duplex apartment", 3, 2, true, true, false, 112,
                    bd("21.1458"), bd("79.0882"),
                    "WiFi, AC, Two floors, Garden access, BBQ grill"),
            new SeedStay("Indore", "Madhya Pradesh", "Central", bd("3500"), bd("650"), bd("4.66"), bd("11"), 4,
                    "Sarafa midnight base", "City apartment", 2, 2, true, false, false, 77,
                    bd("22.7196"), bd("75.8577"),
                    "WiFi, AC, Kitchen, Indore snacks guide, Parking"),
            new SeedStay("Thane", "Maharashtra", "West", bd("9200"), bd("1500"), bd("4.88"), bd("13"), 7,
                    "Yeoor forest edge", "Forest villa", 4, 4, true, true, true, 189,
                    bd("19.2183"), bd("72.9781"),
                    "WiFi, AC, Private lawn, Bonfire pit, EV charger"),
            new SeedStay("Bhopal", "Madhya Pradesh", "Central", bd("3100"), bd("600"), bd("4.39"), bd("12"), 3,
                    "Upper lake mirror", "Lake-view flat", 2, 2, false, false, false, 52,
                    bd("23.2599"), bd("77.4126"),
                    "WiFi, AC, Lake-facing deck, Birdwatching kit"),
            new SeedStay("Visakhapatnam", "Andhra Pradesh", "South", bd("4800"), bd("900"), bd("4.54"), bd("11"), 4,
                    "RK beach loft", "Coastal apartment", 2, 2, true, false, false, 103,
                    bd("17.6868"), bd("83.2185"),
                    "WiFi, AC, Beach 8 min, Surfboard rack"),
            new SeedStay("Patna", "Bihar", "East", bd("1900"), bd("450"), bd("4.12"), bd("12"), 3,
                    "Ganga ghats walk", "Budget homestay", 2, 1, false, false, false, 28,
                    bd("25.5941"), bd("85.1376"),
                    "WiFi, Cooler, Hot water, Family-run meals"),
            new SeedStay("Vadodara", "Gujarat", "West", bd("4100"), bd("720"), bd("4.36"), bd("10"), 4,
                    "Laxmi vilas lane", "Art deco flat", 2, 2, false, true, false, 69,
                    bd("22.3072"), bd("73.1812"),
                    "WiFi, AC, Vintage tiles, Parking, Museum walk maps"),
            new SeedStay("Ghaziabad", "Uttar Pradesh", "North", bd("5600"), bd("880"), bd("4.49"), bd("11"), 5,
                    "NCR express nest", "Family apartment", 3, 2, true, false, false, 95,
                    bd("28.6692"), bd("77.4538"),
                    "WiFi, AC, Metro link, Kids corner, Gated society"),
            new SeedStay("Ludhiana", "Punjab", "North", bd("2400"), bd("550"), bd("4.22"), bd("12"), 3,
                    "Sarson fields window", "Punjabi homestay", 2, 2, false, true, false, 41,
                    bd("30.9010"), bd("75.8573"),
                    "WiFi, AC, Farm-fresh breakfast, Parking"),
            new SeedStay("Coimbatore", "Tamil Nadu", "South", bd("5900"), bd("1000"), bd("4.61"), bd("12"), 4,
                    "Nilgiri gateway", "Plantation cottage", 2, 2, true, false, true, 134,
                    bd("11.0168"), bd("76.9558"),
                    "WiFi, AC, Coffee estate tour, Spice garden"),
            new SeedStay("Kochi", "Kerala", "South", bd("12400"), bd("2000"), bd("4.91"), bd("13"), 4,
                    "Backwater whisper", "Waterfront villa", 3, 3, true, false, true, 356,
                    bd("9.9312"), bd("76.2673"),
                    "WiFi, AC, Kayak dock, Ayurveda spa room, Chef on call"),
            new SeedStay("Nashik", "Maharashtra", "West", bd("4300"), bd("760"), bd("4.55"), bd("11"), 4,
                    "Vineyard breeze", "Wine-country cottage", 2, 2, false, true, false, 87,
                    bd("19.9975"), bd("73.7898"),
                    "WiFi, AC, Vineyard views, Tasting session opt-in"),
            new SeedStay("Varanasi", "Uttar Pradesh", "North", bd("1750"), bd("400"), bd("4.08"), bd("10"), 2,
                    "Ganga blue hour", "Riverside room", 1, 1, false, false, false, 56,
                    bd("25.3176"), bd("83.0105"),
                    "WiFi, Rooftop aarti view, Filtered water, Cultural walks"),
            new SeedStay("Panaji", "Goa", "Islands", bd("15400"), bd("2200"), bd("4.96"), bd("12"), 4,
                    "Shack-to-sky studio", "Beach house", 2, 2, true, true, true, 412,
                    bd("15.4989"), bd("73.8278"),
                    "WiFi, AC, Pool, Beach 2 min, Outdoor shower, Bikes"),
            new SeedStay("Shimla", "Himachal Pradesh", "North", bd("1450"), bd("350"), bd("4.18"), bd("10"), 3,
                    "Ridge pine room", "Mountain cabin", 2, 1, false, true, false, 73,
                    bd("31.1048"), bd("77.1734"),
                    "WiFi, Heating, Wood stove, Trek maps, Hot chai"),
            new SeedStay("Manali", "Himachal Pradesh", "North", bd("4800"), bd("900"), bd("4.74"), bd("11"), 4,
                    "Snow-line chalet", "Alpine chalet", 3, 2, true, false, true, 268,
                    bd("32.2432"), bd("77.1892"),
                    "WiFi, Heating, Bonfire, Ski storage, Valley views"),
            new SeedStay("Udaipur", "Rajasthan", "North", bd("7200"), bd("1300"), bd("4.69"), bd("10"), 3,
                    "Lake Pichola mirror", "Palace-view suite", 2, 2, true, false, true, 299,
                    bd("24.5854"), bd("73.7125"),
                    "WiFi, AC, Lake-facing terrace, Boat pickup opt"),
            new SeedStay("Amritsar", "Punjab", "North", bd("2100"), bd("480"), bd("4.33"), bd("12"), 4,
                    "Golden hour flat", "Heritage apartment", 2, 2, false, false, false, 62,
                    bd("31.6340"), bd("74.8723"),
                    "WiFi, AC, Golden Temple 12 min, Langar tips card"),
            new SeedStay("Mysuru", "Karnataka", "South", bd("4200"), bd("780"), bd("4.57"), bd("12"), 3,
                    "Palace road retreat", "Royal bungalow", 3, 2, true, true, false, 144,
                    bd("12.2958"), bd("76.6394"),
                    "WiFi, AC, Garden, Mysore pak welcome tray"),
            new SeedStay("Shillong", "Meghalaya", "Northeast", bd("2900"), bd("600"), bd("4.40"), bd("11"), 3,
                    "Cloud-end cottage", "Hill cottage", 2, 1, false, false, false, 49,
                    bd("25.5788"), bd("91.8933"),
                    "WiFi, Fireplace, Rain-view deck, Live music tips"),
            new SeedStay("Agra", "Uttar Pradesh", "North", bd("1650"), bd("380"), bd("4.05"), bd("10"), 3,
                    "Taj blush terrace", "Rooftop stay", 2, 1, false, false, false, 201,
                    bd("27.1767"), bd("78.0081"),
                    "WiFi, AC, Taj distant view, Sunrise alarm kit"),
            new SeedStay("Ooty", "Tamil Nadu", "South", bd("8900"), bd("1400"), bd("4.82"), bd("12"), 4,
                    "Tea estate mist", "Tea estate bungalow", 3, 3, true, true, true, 178,
                    bd("11.4102"), bd("76.6950"),
                    "WiFi, Heating, Plantation walk, Toy train timetable"),
            new SeedStay("Gangtok", "Sikkim", "Northeast", bd("8200"), bd("1300"), bd("4.59"), bd("11"), 3,
                    "Kanchenjunga frame", "Himalayan suite", 2, 2, true, false, false, 91,
                    bd("27.3389"), bd("88.6065"),
                    "WiFi, Heating, Mountain view, Permit assist desk"),
            new SeedStay("Rishikesh", "Uttarakhand", "North", bd("2600"), bd("520"), bd("4.46"), bd("10"), 5,
                    "Ganges yoga deck", "Riverside homestay", 3, 2, true, true, false, 156,
                    bd("30.0869"), bd("78.2676"),
                    "WiFi, Yoga shala, River access, Meditation cushions"),
            new SeedStay("Port Blair", "Andaman and Nicobar", "Islands", bd("11200"), bd("1800"), bd("4.77"), bd("13"), 4,
                    "Coral lagoon villa", "Island villa", 3, 3, true, false, true, 94,
                    bd("11.6234"), bd("92.7265"),
                    "WiFi, AC, Snorkel gear, Scooter rental, Ferry timings")
    );

    private static BigDecimal bd(String v) {
        return new BigDecimal(v);
    }

    @Override
    public void run(String... args) {
        User host = null;

        if (userRepository.count() == 0) {
            System.out.println("HeavenHub: seeding users + Indian listings…");

            host = new User();
            host.setFirstName("Priya");
            host.setLastName("Kapoor");
            host.setEmail("alice@heavenhub.com");
            host.setPassword(passwordEncoder.encode("password123"));
            host.setPhoneNumber("+91 98765 43210");
            host.setRole(Role.HOST);

            TrustScore hostScore = new TrustScore();
            hostScore.setScore(4.9);
            hostScore.setNumberOfReviews(212);
            hostScore.setVerifiedId(true);
            hostScore.setUser(host);
            host.setTrustScore(hostScore);
            userRepository.save(host);

            User guest = new User();
            guest.setFirstName("Arjun");
            guest.setLastName("Mehta");
            guest.setEmail("bob@heavenhub.com");
            guest.setPassword(passwordEncoder.encode("password123"));
            guest.setPhoneNumber("+91 91234 56789");
            guest.setRole(Role.GUEST);

            TrustScore guestScore = new TrustScore();
            guestScore.setScore(4.95);
            guestScore.setNumberOfReviews(18);
            guestScore.setVerifiedId(true);
            guestScore.setUser(guest);
            guest.setTrustScore(guestScore);

            userRepository.save(guest);
        } else {
            host = userRepository.findByEmail("alice@heavenhub.com").orElse(null);
            if (host == null) {
                host = userRepository.findAll().stream()
                        .filter(u -> u.getRole() == Role.HOST)
                        .findFirst()
                        .orElse(null);
            }
        }

        if (host != null && propertyRepository.count() == 0) {
            System.out.println("HeavenHub: seeding " + STAYS.size() + " city stays (INR)…");
            propertyRepository.saveAll(buildIndianPortfolio(host));
            System.out.println("HeavenHub: listings ready.");
        }
    }

    private List<Property> buildIndianPortfolio(User host) {
        List<Property> out = new ArrayList<>(STAYS.size());
        int i = 0;
        for (SeedStay s : STAYS) {
            Property p = new Property();
            p.setTitle(s.titleRoot() + " · " + s.city());
            p.setDescription(descFor(s));
            p.setAddress((18 + i) + " " + streetName(i) + ", " + locality(i));
            p.setCity(s.city());
            p.setState(s.state());
            p.setRegion(s.region());
            p.setZipCode(String.format("%06d", 110000 + i * 1547 % 890000));
            p.setPricePerNight(s.pricePerNight());
            p.setCleaningFee(s.cleaningFee());
            p.setAverageRating(s.averageRating());
            p.setPlatformFeePercent(s.platformFeePercent());
            p.setHouseManual(houseManualFor(s));
            p.setMaxGuests(s.maxGuests());
            p.setPropertyType(s.propertyType());
            p.setBedrooms(s.bedrooms());
            p.setBathrooms(s.bathrooms());
            p.setAmenities(s.amenities());
            p.setInstantBook(s.instantBook());
            p.setPetFriendly(s.petFriendly());
            p.setSuperhost(s.superhost());
            p.setReviewCount(s.reviewCount());
            p.setLatitude(s.latitude());
            p.setLongitude(s.longitude());
            p.setHost(host);
            out.add(p);
            i++;
        }
        return out;
    }

    private static String descFor(SeedStay s) {
        return "A curated " + s.propertyType().toLowerCase() + " in " + s.city() + ", " + s.state()
                + " — " + vibeLine(s.region()) + " Rated by " + s.reviewCount()
                + "+ verified guests. Host notes, linen, and local eats card included.";
    }

    private static String vibeLine(String region) {
        return switch (region) {
            case "North" -> "great for heritage walks and winter chai.";
            case "South" -> "sunrise filters coffee and coastal drives.";
            case "East" -> "slow trams, bookshops, and river sunsets.";
            case "West" -> "metro-fast, ocean-slow when you need it.";
            case "Central" -> "heart-of-India calm between two coasts.";
            case "Northeast" -> "mist, music, and mountain air.";
            case "Islands" -> "coconut roads, ferry clocks, endless blue.";
            default -> "made for slow mornings and sharp Wi‑Fi.";
        };
    }

    private static String houseManualFor(SeedStay s) {
        return "Check-in after 2 PM · OTP lock or caretaker meet · Wi‑Fi on the fridge magnet · "
                + "Housekeeping on request · Pets: " + (s.petFriendly() ? "welcome — bowls in cupboard" : "not this stay")
                + " · Instant book: " + (s.instantBook() ? "yes — pack and go" : "host confirms first")
                + " · Emergency: card in drawer · " + s.city() + " local tips in welcome tray.";
    }

    private static String streetName(int i) {
        String[] parts = {"Ring Road", "Lake View Rd", "Station Square", "Club Rd", "Coastal Avenue", "Artillery Rd"};
        return parts[i % parts.length];
    }

    private static String locality(int i) {
        String[] parts = {"Block A", "Sector 7", "Wing East", "Phase 2", "Lane 4", "Enclave"};
        return parts[i % parts.length];
    }
}
