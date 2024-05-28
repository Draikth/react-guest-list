import { useState } from 'react';

export default function App() {
  // Setup initial empty state for name inputs.
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  // New created guests should be set as not attending by default
  const [attendance, setAttendance] = useState(false);

  // Set state for new div elements that act as guest cards
  const [elements, setElements] = useState([]);

  const guestCard = (event) => {
    if (event.key === 'Enter' && lastName.trim() !== '') {
      const newElement = (
        <div key={elements.length} data-test-id="guest">
          {firstName} {lastName}
        </div>
      );
      setElements([...elements, newElement]);

      // Clear input fields
      setFirstName('');
      setLastName('');
    }
  };

  return (
    <main>
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
            onKeyDown={guestCard}
          />
        </form>
        <div>{elements}</div>
      </div>
    </main>
  );
}
