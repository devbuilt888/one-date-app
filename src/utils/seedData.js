import { supabase } from '../lib/supabase'

// Test users data
const testUsers = [
  {
    email: 'alice@test.com',
    password: 'password123',
    profile: {
      display_name: 'Alice Johnson',
      age: 25,
      gender: 'female',
      preferences_gender: ['male'],
      bio: 'Love hiking and outdoor adventures! Looking for someone to explore the city with.',
      interests: ['hiking', 'photography', 'travel'],
      lat: 40.7128,
      lng: -74.0060,
      geohash: 'dr5reg',
      photo_urls: ['/images/users/sarahJohnson.jpeg']
    }
  },
  {
    email: 'bob@test.com',
    password: 'password123',
    profile: {
      display_name: 'Bob Smith',
      age: 28,
      gender: 'male',
      preferences_gender: ['female'],
      bio: 'Musician and coffee enthusiast. Always up for a good conversation over coffee.',
      interests: ['music', 'coffee', 'books'],
      lat: 40.7589,
      lng: -73.9851,
      geohash: 'dr5ruj',
      photo_urls: ['/images/users/emmaWilson.jpeg']
    }
  },
  {
    email: 'charlie@test.com',
    password: 'password123',
    profile: {
      display_name: 'Charlie Brown',
      age: 30,
      gender: 'male',
      preferences_gender: ['female'],
      bio: 'Foodie and fitness enthusiast. Love trying new restaurants and staying active.',
      interests: ['fitness', 'cooking', 'travel'],
      lat: 40.7505,
      lng: -73.9934,
      geohash: 'dr5ru6',
      photo_urls: ['/images/users/oliviaBrown.jpeg']
    }
  },
  {
    email: 'diana@test.com',
    password: 'password123',
    profile: {
      display_name: 'Diana Prince',
      age: 27,
      gender: 'female',
      preferences_gender: ['male'],
      bio: 'Artist and yoga instructor. Looking for someone who appreciates creativity and mindfulness.',
      interests: ['art', 'yoga', 'meditation'],
      lat: 40.7614,
      lng: -73.9776,
      geohash: 'dr5ruu',
      photo_urls: ['/images/users/avaDavis.jpeg']
    }
  }
]

// Test events data
const testEvents = [
  {
    title: 'Speed Dating Night',
    category: 'Dating',
    description: 'Meet new people in a fun, structured environment',
    lat: 40.7128,
    lng: -74.0060,
    location_name: 'Downtown Cafe',
    starts_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
  },
  {
    title: 'Wine Tasting Experience',
    category: 'Social',
    description: 'Sample wines from local vineyards',
    lat: 40.7589,
    lng: -73.9851,
    location_name: 'Vintage Cellars',
    starts_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() // Day after tomorrow
  },
  {
    title: 'Cooking Class for Couples',
    category: 'Dating',
    description: 'Learn to cook together and bond over food',
    lat: 40.7505,
    lng: -73.9934,
    location_name: 'Culinary Studio',
    starts_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days from now
  }
]

export const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...')

    // Create test users one by one with delays
    for (let i = 0; i < testUsers.length; i++) {
      const userData = testUsers[i]
      console.log(`Creating user ${i + 1}/${testUsers.length}: ${userData.email}`)
      
      try {
        // Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password
        })

        console.log(`Auth response for ${userData.email}:`, { 
          user: authData.user ? 'User created' : 'No user', 
          error: authError ? authError.message : 'No error' 
        })

        if (authError) {
          console.error(`❌ Error creating user ${userData.email}:`, authError.message)
          continue
        }

        if (authData.user) {
          console.log(`✅ Auth user created: ${userData.email}`)
          
          // Wait longer for the user to be fully created
          console.log('⏳ Waiting for user to be fully created...')
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              ...userData.profile
            })

          if (profileError) {
            console.error(`❌ Error creating profile for ${userData.email}:`, profileError.message)
          } else {
            console.log(`✅ Created profile for: ${userData.email}`)
          }
        } else {
          console.error(`❌ No user data returned for ${userData.email}`)
        }
        
        // Wait between users to avoid rate limiting
        if (i < testUsers.length - 1) {
          console.log('⏳ Waiting before creating next user...')
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        
      } catch (error) {
        console.error(`❌ Exception creating user ${userData.email}:`, error.message)
      }
    }

    // Create test events
    console.log('Creating test events...')
    const { error: eventsError } = await supabase
      .from('events')
      .insert(testEvents)

    if (eventsError) {
      console.error('Error creating events:', eventsError)
    } else {
      console.log('✅ Created test events')
    }

    console.log('🎉 Database seeding completed!')
    console.log('You can now test with these accounts:')
    testUsers.forEach(user => {
      console.log(`- ${user.email} / password123`)
    })

  } catch (error) {
    console.error('Error seeding database:', error)
  }
}

// Function to clear test data (use with caution!)
export const clearTestData = async () => {
  try {
    console.log('🧹 Clearing test data...')
    
    // Delete test events
    await supabase.from('events').delete().like('title', '%')
    
    console.log('✅ Test data cleared')
  } catch (error) {
    console.error('Error clearing test data:', error)
  }
}
