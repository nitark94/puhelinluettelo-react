import { useState, useEffect } from 'react';
import personsService from './services/persons';
import Filter from './Filter';
import PersonForm from './PersonForm';
import Persons from './Persons';
import Notification from './Notification';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const existingPerson = persons.find(person => person.name === newName);
    const newPerson = { name: newName, number: newNumber };

    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .update(existingPerson.id, newPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
            setNotification({ message: `Updated ${newName}`, type: 'success' });
          })
          .catch(error => {
            setNotification({ message: `Information of ${newName} has already been removed from server`, type: 'error' });
          });
      }
    } else {
      personsService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNotification({ message: `Added ${newName}`, type: 'success' });
        })
        .catch(error => {
          setNotification({ message: `Failed to add ${newName}`, type: 'error' });
        });
    }

    setNewName('');
    setNewNumber('');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personsService
        .removePerson(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id));
          setNotification({ message: `Deleted ${name}`, type: 'success' });
        })
        .catch(error => {
          setNotification({ message: `Failed to delete ${name}`, type: 'error' });
        });
    }
  };

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} onFilterChange={setFilter} />
      <h3>Add a new</h3>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        onNameChange={e => setNewName(e.target.value)}
        onNumberChange={e => setNewNumber(e.target.value)}
        onFormSubmit={handleFormSubmit}
      />
      <h3>Numbers</h3>
      <Persons persons={filteredPersons} onDelete={handleDelete} />
      <Notification message={notification.message} type={notification.type} />
    </div>
  );
};

export default App;
