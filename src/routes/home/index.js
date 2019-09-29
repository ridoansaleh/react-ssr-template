import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import './home.style.scss';
import usd100 from './100_usd.jpg';

const EXCHANGE_RATES = gql`
  {
    rates(currency: "USD") {
      currency
      name
      rate
    }
  }
`;

function HomePage() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <h1 className="title">Exchange of USD to other currencies in the world</h1>
      <img className="dollar-image" src={usd100} alt="100 USD" />
      {data.rates.map(({ currency, name, rate }) => (
        <div key={currency}>
          <div className="currency-item">
            <div className="currency-abbreviation">{currency}</div>
            <div className="currency-name">{name}</div>
            <div className="currency-rate">{rate}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;
