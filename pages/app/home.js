import React from 'react';
import Head from 'next/head';
import AuthLayout from '../../src/components/layout-components/AuthLayout';

export default function AppHomePage() {
  return (
    <AuthLayout>
      <Head>
        <title>Home - Area di Amministrazione</title>
      </Head>

      <div className="container-fluid">
        <div className="welcome-message" style={{ padding: '20px' }}>
          <h1>Benvenuto nell'Area di Amministrazione!</h1>
          <p>
            Questa è la tua dashboard principale da cui puoi creare il tuo canale, personalizzare il tuo profilo e aggiungere nuovi contenuti. Di seguito trovi una breve guida sulle funzionalità disponibili e su come utilizzarle:
          </p>

          <h2>Modifica Profilo</h2>
          <ul>
            <li>
              <strong>Aggiorna le tue informazioni personali</strong>: Puoi modificare il tuo nome, indirizzo email, password e altre informazioni relative al tuo profilo.
            </li>
            <li>
              <strong>Profilo pubblico</strong>: Decidi tu se il tuo profilo deve essere pubblico o nascosto. Un profilo pubblico ti permette di ricevere più visite e visualizzazioni dei contenuti da te caricati.
            </li>
            <li>
              <strong>Inserire dati di fatturazione</strong>: Se hai in mente di inserire contenuti a pagamento è necessario fornirci i dati di fatturazione in modo da poterti pagare gli incassi dalle vendite.
            </li>
          </ul>

          <h2>Aggiungi Contenuti</h2>
          <ul>
            <li>
              <strong>Crea nuovi contenuti</strong>: Aggiungi nuovi contenuti, inserisci un titolo, registra o carica un audio ed inserisci un'immagine. Fai attenzione alla geolocalizzazione esatta del punto che inserisci.
            </li>
            <li>
              <strong>Dai un nome al tuo canale</strong>: Puoi usare il tuo nome o un nickname per il tuo canale. Qui verranno visualizzati tutti i contenuti da te inseriti.
            </li>
            <li>
              <strong>Gestisci contenuti esistenti</strong>: Modifica, aggiorna o elimina i contenuti già pubblicati.
            </li>
          </ul>

          <p>
            Se hai bisogno di assistenza o hai domande, non esitare a contattare il supporto tecnico alla mail{' '}
            <a href="mailto:info@guides4you.it">info@guides4you.it</a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
