import './App.css';
import { useEffect, useState } from 'react';

// URL for the API
const baseUrl = 'https://jzc57q-4000.csb.app';

export default function App() {
  // Setup initial empty state for name inputs and guest list.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [guestList, setGuestList] = useState([]);

  // show all guests in list (from express-guest-list-api)
  useEffect(() => {
    async function showList() {
      const response = await fetch(`${baseUrl}/guests`);
      const list = await response.json();
      setGuestList(list);
    }
    showList().catch((error) => console.log(error));
  }, []);

  // Getting single guest from list (from express-guest-list-api)

  async function retrieveOneGuest() {
    const response = await fetch(`${baseUrl}/guests/:id`);
    const guest = await response.json();
  }

  // Function for creating new Guest with POST method
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

    setGuestList(newGuestList);
  }

  // Updating a guest in list with PUT method (from express-guest-list-api)
  /* const response = await fetch(`${baseUrl}/guests/1`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ attending: true }),
  });
  const updatedGuest = await response.json();
  */

  async function removeGuest(id) {
    if (id.length > 0) {
      const response = await fetch(`${baseUrl}/guests/${id}`, {
        method: 'DELETE',
      });
      const deletedGuest = await response.json();
      const currentGuestList = [...guestList];
      const newGuestList = currentGuestList.filter(
        (guest) => guest.id !== deletedGuest.id,
      );
      setGuestList(newGuestList);
    }
  }

  return (
    <main>
      <div>
        <h1>Guest List</h1>
        <div data-test-id="guest">
          <form onSubmit={(event) => event.preventDefault()}>
            <label htmlFor="First name">First Name: </label>
            <input
              id="First name"
              name="First name"
              placeholder="First Name"
              value={firstName}
              onChange={(event) => setFirstName(event.currentTarget.value)}
            />
            <br />
            <label htmlFor="Last name">Last Name: </label>
            <input
              id="Last name"
              name="Last name"
              placeholder="Last Name"
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
            <div>list of guests will be here</div>
          </div>
        </div>
      </div>
    </main>
  );
}
