import './App.css';
import { useEffect, useState } from 'react';

// URL for the API
const baseUrl = 'https://jzc57q-4000.csb.app';

export default function App() {
  // Setup initial empty state for name inputs and guest list.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);

  // Setup initial state for loading from api
  const [isLoading, setIsLoading] = useState(true);

  // Async function to show all guests in list (from express-guest-list-api)
  useEffect(() => {
    async function showList() {
      const response = await fetch(`${baseUrl}/guests`);
      const list = await response.json();
      setGuestList(list);
      setIsLoading(false);
    }

    showList().catch((error) => console.log(error));
  }, []);

  // Async Function for creating new Guest with POST method(from express-guest-list-api)
  async function addGuest() {
    const guestInputs = {
      firstName: firstName,
      lastName: lastName,
      attending: false,
    };
    const response = await fetch(`${baseUrl}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestInputs),
    });
    const createdGuest = await response.json();
    const newGuestList = [...guestList, createdGuest];

    setGuestList(newGuestList); // update the guest list
    setFirstName(''); // clear the input fields
    setLastName('');
  }

  // Updating a guest attendance status in list with PUT method (from express-guest-list-api)
  async function changeAttendance(id, attending) {
    const change = !attending;
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: change }),
    });
    const updatedAttendance = await response.json();

    // Check to see if guest id matches and if yes return guest id with new status, otherwise just return the original data
    const newGuestList = guestList.map((guest) => {
      if (guest.id === id) {
        return { ...guest, attending: updatedAttendance.attending };
      } else {
        return guest;
      }
    });
    setGuestList(newGuestList);
  }

  // Async function to delete a guest from the list with DELETE method (from express-guest-list-api)
  async function removeGuest(id) {
    const response = await fetch(`${baseUrl}/guests/${id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    const newGuestList = guestList.filter(
      (guest) => guest.id !== deletedGuest.id,
    );
    setGuestList(newGuestList);
  }

  // Display the Guest first and last names as well a checkbox to indicate attendance and a button to remove the guest from the list.
  let guestNames;
  if (guestList.length > 0) {
    guestNames = (
      <ul>
        {guestList.map((guest) => (
          <li key={`guestID-${guest.id}`}>
            {guest.firstName} {guest.lastName}
            <br />
            {/* Checkbox for setting attendance*/}
            <input
              aria-label={`${guest.firstName} ${guest.lastName} attending status`}
              type="checkbox"
              checked={guest.attending}
              onChange={() => {
                changeAttendance(guest.id, guest.attending).catch((error) =>
                  console.log(error),
                );
              }}
            />
            <span>{guest.attending ? 'Attending' : 'Not Attending'}</span>
            <br />
            {/* Button to remove guest from guest list*/}
            <button
              aria-label={`Remove ${guest.firstName} ${guest.lastName}`}
              onClick={() => {
                removeGuest(guest.id).catch((error) => console.log(error));
              }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    );
  } else {
    guestNames = <p>No current Guests</p>;
  }

  if (isLoading) {
    return <h1>Guest List Loading...</h1>;
  }
  return (
    <main>
      <div>
        <h1>React Guest List Project</h1>
        <div data-test-id="guest">
          <form onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="First name">First Name: </label>
            <input
              id="First name"
              name="First name"
              placeholder="Guest First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
            />
            <br />
            <label htmlFor="Last name">Last Name: </label>
            <input
              id="Last name"
              name="Last name"
              placeholder="Guest Last Name"
              value={lastName}
              onChange={(event) => setLastName(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  addGuest().catch((error) => console.log(error));
                }
              }}
            />
          </form>
          <div>
            <h2>Current Guest List</h2>
            <div data-test-id="guest">{guestNames}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
