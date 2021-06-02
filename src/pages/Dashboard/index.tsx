// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';

import { Title, Form, Repositories, Error } from './styles';

import api from '../../services/api';

interface Repository {
  // eslint-disable-next-line camelcase
  full_name: string;
  description: string;
  owner: {
    login: string;
    // eslint-disable-next-line camelcase
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');

  const [repositorioes, setRepositorioes] = useState<Repository[]>(() => {
    const storagedRepositorioes = localStorage.getItem(
      '@GithubExplorer:repositorioes',
    );
    if (storagedRepositorioes) {
      return JSON.parse(storagedRepositorioes);
    }
    return [];
  });

  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:repositorioes',
      JSON.stringify(repositorioes),
    );
  }, [repositorioes]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setInputError('Digite o autor/nome do repositorio');
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositorioes([...repositorioes, repository]);
      setNewRepo('');
      setInputError('');
    } catch (error) {
      setInputError('Autor/repositorio invalidos ou não existem');
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github explore" />
      <Title>Explore reposítorios no github</Title>
      {
        // ! significa falsy, covernte o valor para true se a variavel tiver algo e
        // false se não tiver nada
        // !! vai converte para true se tiver algo e depois converte para false, se não
        //  tiver nada converte
        // Para false e depois converte para true
      }
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={e => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositorio"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositorioes.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={`Avatar by ${repository.owner.login}`}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
