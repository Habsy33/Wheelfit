import { db, ref, push, onValue, auth, get, update, remove, set } from "@/firebaseConfig";
import { User } from "firebase/auth";

interface Meetup {
  id: string;
  date: string;
  title: string;
  location: string;
  format: string;
  details: string;
  address: string;
  venueSize: string;
  duration: string;
  maxParticipants: number;
  currentParticipants: number;
}

interface UserMeetup {
  meetupId: string;
  userId: string;
  status: 'confirmed' | 'cancelled';
  timestamp: number;
}

export const createMeetup = async (meetupData: Omit<Meetup, 'id'>) => {
  const meetupRef = ref(db, 'meetups');
  
  try {
    const newMeetupRef = await push(meetupRef);
    const meetup: Meetup = {
      id: newMeetupRef.key!,
      ...meetupData,
      currentParticipants: 0
    };
    
    await set(newMeetupRef, meetup);
    return meetup;
  } catch (error) {
    console.error("Error creating meetup:", error);
    throw error;
  }
};

export const initializeDefaultMeetups = async () => {
  const defaultMeetups = [
    {
      date: 'Feb 24',
      title: 'Adaptive Yoga Session',
      location: 'Glasgow',
      format: 'In-Person',
      details: 'A yoga session tailored for wheelchair users and those with limited mobility.',
      address: '123 Fitness Street, Glasgow G1 1AA',
      venueSize: 'Medium (up to 20 participants)',
      duration: '1 hour',
      maxParticipants: 20,
      currentParticipants: 0
    },
    {
      date: 'Mar 2',
      title: 'Virtual Strength Training',
      location: 'Online',
      format: 'Virtual',
      details: 'A strength-building class conducted via Zoom, focusing on upper body mobility.',
      address: 'Online via Zoom',
      venueSize: 'Unlimited',
      duration: '45 minutes',
      maxParticipants: 50,
      currentParticipants: 0
    },
    {
      date: 'Mar 10',
      title: 'Community Walk',
      location: 'Edinburgh',
      format: 'In-Person',
      details: 'Join us for a social walk with accessible routes and great company.',
      address: '456 Park Avenue, Edinburgh EH1 1BB',
      venueSize: 'Large (up to 30 participants)',
      duration: '2 hours',
      maxParticipants: 30,
      currentParticipants: 0
    }
  ];

  try {
    const meetupRef = ref(db, 'meetups');
    const snapshot = await get(meetupRef);
    
    if (!snapshot.exists()) {
      for (const meetup of defaultMeetups) {
        await createMeetup(meetup);
      }
      console.log("Default meetups initialized successfully!");
    }
  } catch (error) {
    console.error("Error initializing default meetups:", error);
    throw error;
  }
};

export const confirmMeetupAttendance = async (meetupId: string) => {
  const user: User | null = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userMeetupRef = ref(db, `userMeetups/${user.uid}/${meetupId}`);
  const meetupRef = ref(db, `meetups/${meetupId}`);

  try {
    // Check if meetup exists and has capacity
    const meetupSnapshot = await get(meetupRef);
    if (!meetupSnapshot.exists()) {
      throw new Error("Meetup not found");
    }

    const meetupData = meetupSnapshot.val();
    if (meetupData.currentParticipants >= meetupData.maxParticipants) {
      throw new Error("Meetup is at full capacity");
    }

    // Create user meetup record
    const userMeetup: UserMeetup = {
      meetupId,
      userId: user.uid,
      status: 'confirmed',
      timestamp: Date.now()
    };

    await set(userMeetupRef, userMeetup);

    // Update meetup participant count
    await update(meetupRef, {
      currentParticipants: meetupData.currentParticipants + 1
    });

    console.log("Meetup attendance confirmed successfully!");
  } catch (error) {
    console.error("Error confirming meetup attendance:", error);
    throw error;
  }
};

export const cancelMeetupAttendance = async (meetupId: string) => {
  const user: User | null = auth.currentUser;
  if (!user) {
    throw new Error("User not authenticated");
  }

  const userMeetupRef = ref(db, `userMeetups/${user.uid}/${meetupId}`);
  const meetupRef = ref(db, `meetups/${meetupId}`);

  try {
    // Update user meetup status
    await update(userMeetupRef, {
      status: 'cancelled',
      timestamp: Date.now()
    });

    // Decrease meetup participant count
    const meetupSnapshot = await get(meetupRef);
    if (meetupSnapshot.exists()) {
      const meetupData = meetupSnapshot.val();
      await update(meetupRef, {
        currentParticipants: Math.max(0, meetupData.currentParticipants - 1)
      });
    }

    console.log("Meetup attendance cancelled successfully!");
  } catch (error) {
    console.error("Error cancelling meetup attendance:", error);
    throw error;
  }
};

export const getUserMeetups = (callback: (meetups: UserMeetup[]) => void) => {
  const user: User | null = auth.currentUser;
  if (!user) {
    callback([]);
    return;
  }

  const userMeetupsRef = ref(db, `userMeetups/${user.uid}`);
  
  onValue(userMeetupsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const meetupsArray = Object.entries(data).map(([meetupId, meetupData]: [string, any]) => ({
        meetupId,
        ...meetupData
      }));
      callback(meetupsArray);
    } else {
      callback([]);
    }
  });
};

export const getMeetupDetails = async (meetupId: string): Promise<Meetup | null> => {
  const meetupRef = ref(db, `meetups/${meetupId}`);
  
  try {
    const snapshot = await get(meetupRef);
    if (snapshot.exists()) {
      return {
        id: meetupId,
        ...snapshot.val()
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching meetup details:", error);
    return null;
  }
};

export const getUserMeetupsWithDetails = async (userId: string): Promise<Meetup[]> => {
  try {
    // First get all meetups the user has signed up for
    const userMeetupsRef = ref(db, `userMeetups/${userId}`);
    const userMeetupsSnapshot = await get(userMeetupsRef);
    
    if (!userMeetupsSnapshot.exists()) {
      return [];
    }

    const userMeetupsData = userMeetupsSnapshot.val();
    const confirmedMeetupIds = Object.entries(userMeetupsData)
      .filter(([_, data]: [string, any]) => data.status === 'confirmed')
      .map(([id]) => id);

    // Then fetch the details for each confirmed meetup
    const meetupsRef = ref(db, 'meetups');
    const meetupsSnapshot = await get(meetupsRef);
    
    if (!meetupsSnapshot.exists()) {
      return [];
    }

    const allMeetups = meetupsSnapshot.val();
    return confirmedMeetupIds
      .map(id => ({
        id,
        ...allMeetups[id]
      }))
      .filter(meetup => meetup.id); // Filter out any undefined entries
  } catch (error) {
    console.error("Error fetching user meetups with details:", error);
    return [];
  }
}; 