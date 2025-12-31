# Troubleshooting - Civiglio Web Next.js

## 🐛 Problemi Risolti

### ❌ Errore: "Exceeded maximum endpoint per user count:15"

**Problema**: Durante il login ricevi questo errore:
```
Exceeded maximum endpoint per user count:15
```

**Causa**: AWS Pinpoint Analytics crea un endpoint ogni volta che un utente fa login. Durante i test di sviluppo, vengono creati troppi endpoint per lo stesso utente, superando il limite di 15.

**Soluzione Applicata**: ✅
Analytics è stato **disabilitato temporaneamente** durante lo sviluppo in `pages/_app.js`:

```javascript
const configWithoutAnalytics = {
  ...awsExports,
  Analytics: {
    disabled: true, // Disabilita Analytics durante lo sviluppo
  },
};
Amplify.default.configure(configWithoutAnalytics);
```

**Come Riabilitare Analytics in Produzione**:

Quando sei pronto per il deploy in produzione:

1. Modifica `pages/_app.js`
2. Rimuovi la sezione `Analytics: { disabled: true }`
3. Usa la configurazione standard:

```javascript
Amplify.default.configure(awsExports);
```

**Alternativa - Pulizia Endpoint AWS Pinpoint** (Opzionale):

Se vuoi riabilitare Analytics anche in sviluppo, pulisci i vecchi endpoint:

1. Vai su AWS Console → Amazon Pinpoint
2. Seleziona l'app: `78aa644faacd4d5bb9038654647b3ecf`
3. Settings → Endpoints → Cerca il tuo utente
4. Elimina endpoint vecchi/duplicati
5. Riabilita Analytics nel codice

---

## 🔍 Altri Problemi Comuni

### Server Non Si Avvia

```bash
# Uccidi processo su porta 3000
lsof -ti:3000 | xargs kill -9

# Riavvia
npm run dev
```

### Errori di Compilazione Next.js

```bash
# Pulisci cache Next.js
rm -rf .next

# Reinstalla node_modules se necessario
rm -rf node_modules
npm install --legacy-peer-deps

# Riavvia
npm run dev
```

### Errore "Module not found"

Verifica che:
1. Il percorso del file sia corretto
2. Il componente esista in `src/`
3. Gli import usino path corretti (relativi o alias `@/`)

Esempio:
```javascript
// ✅ Corretto
import Component from '../components/Component';
import Component from '@/components/Component';

// ❌ Sbagliato
import Component from 'components/Component'; // Manca ../ o @/
```

### Amplify Auth Non Funziona

Verifica che:
1. `aws-exports.js` sia presente in `src/`
2. Amplify sia configurato in `_app.js` (controlla console browser)
3. Cognito User Pool sia attivo su AWS

Console browser dovrebbe mostrare:
```
✅ Amplify configured successfully (Analytics disabled)
```

### Redux DevTools Non Funziona

1. Installa Redux DevTools Extension per Chrome/Firefox
2. Ricarica la pagina
3. Apri DevTools → Redux tab
4. Dovresti vedere `auth` e `theme` nello state

---

## 📝 Logs Utili

### Check Amplify Config
```javascript
// Nella console browser
console.log(Amplify.configure());
```

### Check Auth State
```javascript
// Nella console browser
Auth.currentAuthenticatedUser()
  .then(user => console.log('User:', user))
  .catch(err => console.log('Not authenticated'));
```

### Check Redux State
```javascript
// Nella console browser (se hai accesso a store)
console.log(store.getState());
```

---

## 🆘 Bisogno di Aiuto?

Se incontri altri problemi:

1. **Check Console Browser**: Apri DevTools (F12) e controlla errori
2. **Check Terminal**: Guarda output del server Next.js
3. **Verifica File**: Assicurati che tutti i file necessari esistano
4. **Riavvia Server**: A volte basta un riavvio

Se il problema persiste, documenta:
- Errore esatto (screenshot o testo)
- Steps per riprodurlo
- File coinvolti
- Output console browser e terminal
