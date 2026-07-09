import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';
dotenv.config();

// Force Google DNS so MongoDB Atlas SRV records always resolve
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

// ---- Models (inline so we don't need to import from api/) ----
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
  },
  { timestamps: true }
);
const User = mongoose.model('User', userSchema);

const listingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    type: { type: String, required: true },
    offer: { type: Boolean, required: true },
    imageUrls: { type: Array, required: true },
    userRef: { type: String, required: true },
  },
  { timestamps: true }
);
const Listing = mongoose.model('Listing', listingSchema);

// ---- Seed Data ----
const SEED_PASSWORD = 'Password123!';

const users = [
  {
    username: 'tariq_malik92',
    email: 'tariq.malik92@gmail.com',
    avatar:
      'https://randomuser.me/api/portraits/men/34.jpg',
  },
  {
    username: 'ayesha_homes',
    email: 'ayesha.real.estate@outlook.com',
    avatar:
      'https://randomuser.me/api/portraits/women/68.jpg',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO);
  console.log('✅  Connected to MongoDB');

  // ---------- Users ----------
  const hashedPw = await bcryptjs.hash(SEED_PASSWORD, 10);

  const createdUsers = [];
  for (const u of users) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`   ↩  User already exists: ${u.email}`);
      createdUsers.push(existing);
    } else {
      const doc = await User.create({ ...u, password: hashedPw });
      console.log(`   ✔  Created user: ${u.username}`);
      createdUsers.push(doc);
    }
  }

  const [tariq, ayesha] = createdUsers;

  // ---------- Listings ----------
  const listings = [
    // ---- FOR SALE ----
    {
      name: 'Corner House DHA Phase 5',
      description:
        'Solid grey structure house on a 10 marla corner plot. Ground floor is already finished — tiles done, kitchen cabinets installed. Upper portion is unfinished so you can customise it. Boundary wall is brand new. Two cars easily fit in the driveway. Society has 24hr security.',
      address: '47-C, Khayaban-e-Ittehad, DHA Phase 5, Karachi',
      regularPrice: 32500000,
      discountPrice: 31000000,
      bathrooms: 4,
      bedrooms: 5,
      furnished: false,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900',
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900',
      ],
      userRef: tariq._id.toString(),
    },
    {
      name: 'Modern Apartment in Clifton Block 5',
      description:
        'Third floor apartment in a well-maintained 8-storey building. North-facing so stays cool most of the year. Geyser, AC units in all rooms, and fitted kitchen with gas connection. Lift works fine. Building has its own borehole so water is never an issue.',
      address: 'Flat 3-C, Shaheen Heights, Block 5 Clifton, Karachi',
      regularPrice: 18000000,
      discountPrice: 18000000,
      bathrooms: 3,
      bedrooms: 3,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: false,
      imageUrls: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900',
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900',
      ],
      userRef: ayesha._id.toString(),
    },
    {
      name: 'Plot + New Build - Gulberg III',
      description:
        'Double storey on 5 marla plot. Construction finished 2023. Italian marble throughout ground floor, wooden flooring upstairs. Master bedroom has walk-in closet and attached bath with jacuzzi. Street is wide enough for two cars to pass. Near MM Alam road so everything is walkable.',
      address: 'Street 9, Block D, Gulberg III, Lahore',
      regularPrice: 28000000,
      discountPrice: 27000000,
      bathrooms: 5,
      bedrooms: 4,
      furnished: true,
      parking: true,
      type: 'sale',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900',
      ],
      userRef: tariq._id.toString(),
    },

    // ---- FOR RENT ----
    {
      name: 'Furnished Studio - Bahria Town Rawalpindi',
      description:
        'Compact studio apartment on the 6th floor of Bahria Heights. Separate sleeping area partitioned with glass. Kitchen is small but fully equipped — microwave, mini fridge, induction cooker. Broadband cable is already installed. Society charges Rs 4,500 per month extra for maintenance.',
      address: 'Tower B, Bahria Heights 3, Sector E, Bahria Town, Rawalpindi',
      regularPrice: 45000,
      discountPrice: 40000,
      bathrooms: 1,
      bedrooms: 1,
      furnished: true,
      parking: false,
      type: 'rent',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900',
        'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=900',
      ],
      userRef: ayesha._id.toString(),
    },
    {
      name: 'Upper Portion - F-10/3 Islamabad',
      description:
        'Upper portion of a proper house, not an apartment block. You get a private staircase entrance. Three bedrooms, attached baths in two of them. Drawing room is separate from the TV lounge. Lawn access shared with owner but only on the right side. Very quiet street, mostly owner-occupied houses.',
      address: 'House 23, Street 14, F-10/3, Islamabad',
      regularPrice: 110000,
      discountPrice: 110000,
      bathrooms: 3,
      bedrooms: 3,
      furnished: false,
      parking: true,
      type: 'rent',
      offer: false,
      imageUrls: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900',
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900',
      ],
      userRef: tariq._id.toString(),
    },
    {
      name: 'Office Space Ground Floor - Model Town Lahore',
      description:
        'Ground floor of a corner house converted to office use. Two separate rooms plus a reception area. Attached washroom. Parking for 3 cars inside gate. Generator connection already there — just bring your own genset or connect UPS. Good footfall area, suitable for clinic, tuition centre, or small business.',
      address: 'Block H, Model Town, Lahore',
      regularPrice: 90000,
      discountPrice: 85000,
      bathrooms: 1,
      bedrooms: 2,
      furnished: false,
      parking: true,
      type: 'rent',
      offer: true,
      imageUrls: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=900',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900',
      ],
      userRef: ayesha._id.toString(),
    },
  ];

  let added = 0;
  for (const l of listings) {
    const existing = await Listing.findOne({ name: l.name, address: l.address });
    if (existing) {
      console.log(`   ↩  Listing already exists: ${l.name}`);
    } else {
      await Listing.create(l);
      console.log(`   ✔  Created listing: ${l.name}`);
      added++;
    }
  }

  console.log(`\n🎉  Done! ${added} new listing(s) inserted.`);
  console.log(`\n📋  Demo login credentials:`);
  console.log(`    Email:    tariq.malik92@gmail.com`);
  console.log(`    Password: ${SEED_PASSWORD}`);
  console.log(`\n    Email:    ayesha.real.estate@outlook.com`);
  console.log(`    Password: ${SEED_PASSWORD}`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message);
  process.exit(1);
});
