import { useState, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
// import '../styles/App.scss';
// import PropTypes from 'prop-types';

import Form from "./Form/Form";
import CharacterList from "./Character/CharacterList";
import CharacterDetail from './Character/CharacterDetail';
import NotFound from './NotFound'

import callToApi from '../services/callToApi';
import ls from '../services/localStorage'



function App() {

  const [house, setHouse] = useState(ls.get('house', 'gryffindor'));
  const [name, setName] = useState(ls.get('name', ''));
  const [blood, setBlood] = useState(ls.get('blood', ''))
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    callToApi(house).then((charactersData) => {
      setCharacters(charactersData);
    })
  }, [house]);

  useEffect(() => {
    ls.set('house', house);
  }, [house]);
  useEffect(() => {
    ls.set('name', name);
  }, [name]);
  useEffect(() => {
    ls.set('blood', blood);
  }, [blood]);

  const handleFilter = (form) => {
    if (form.key === 'house') {
      setHouse(form.value);
    } else if (form.key === 'name') {
      setName(form.value);
    } else if (form.key === 'blood') {
      setBlood(form.value);
    }
  }

  const filteredCharacters = characters
    .filter((character) => {
      return character.name.toLocaleLowerCase().includes(name.toLocaleLowerCase());
    }
    )
    .filter((character) => {
      return character.blood.includes(blood);
    })

  const routeCharacterData = useRouteMatch('/character/:characterId');
  const getRouteCharacter = () => {
    if (routeCharacterData !== null) {
      const routeCharacterId = routeCharacterData.params.characterId;
      return characters.find(character => {
        return character.id === routeCharacterId;
      });
    }
  }

  return (
    <div>
      <h1>Harry Potter Characters Database</h1>
      <Switch>
        <Route exact path="/">
          <Form house={house} name={name} blood={blood} handleFilter={handleFilter} />
          <CharacterList characters={filteredCharacters} name={name} />
        </Route>
        <Route path="/character/:characterId" ><CharacterDetail character={getRouteCharacter()} /></Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div >
  );
}

export default App;
