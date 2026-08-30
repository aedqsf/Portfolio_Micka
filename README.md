# Portfolio — Mickaël Solomin

Site vitrine, saxophoniste interprète.

Site statique en **HTML / CSS / JavaScript**, sans framework et sans étape de compilation.
Pas de Node, pas de `npm install` : on ouvre le fichier, on modifie, c'est en ligne.

**En ligne :** https://aedqsf.github.io/Portfolio_Micka/

---

## Voir le site sur mon ordinateur

Double-clique sur `index.html`. C'est tout.

Après chaque modification, enregistre le fichier et recharge la page dans le navigateur
(`Ctrl + F5` pour forcer le rechargement si tu ne vois pas le changement).

---

## État actuel du site

**En ligne :** page d'accueil (nom + « saxophoniste interprète ») et section contact.

**En attente**, faute de contenu : parcours, vidéos, concerts, photos.

Ces quatre sections sont déjà écrites et fonctionnelles dans `index.html`, mais
volontairement éteintes : rien ne s'affiche et rien ne se charge tant qu'elles le sont.
Elles t'attendent, il n'y a plus qu'à les remplir.

### Rallumer une section

Dans `index.html`, chaque section en attente est encadrée par deux lignes :

```html
<template data-section="concerts">
  ... toute la section ...
</template>
```

Pour la rallumer :

1. supprime la ligne `<template data-section="...">`
2. supprime la ligne `</template>` correspondante
3. remplis le contenu (les commentaires t'indiquent quoi mettre et où)
4. rajoute son lien dans le menu — le bloc de navigation en haut du fichier te donne
   la ligne exacte à copier

---

## Où modifier quoi

| Ce que tu veux changer | Fichier | Repère |
|---|---|---|
| Textes, dates, vidéos, liens | `index.html` | commentaires `A REMPLIR` / `POUR AJOUTER` |
| Couleurs et polices | `assets/css/style.css` | tout en haut, bloc `:root` |
| Photos | `assets/img/` | remplace les fichiers |
| Comportements (filtres, galerie…) | `assets/js/main.js` | sections numérotées 1 à 7 |

### Changer les couleurs

Tout en haut de `assets/css/style.css` :

```css
--bg:     #0a0a0b;   /* fond principal */
--bg-alt: #101012;   /* fond des sections alternées */
--accent: #c8a45c;   /* doré : liens, traits, boutons */
```

Change `--accent` et toute l'ambiance du site suit.

### Mettre une photo de fond sur l'accueil

Pour l'instant, l'accueil affiche un dégradé sombre (`assets/img/hero.svg`) : c'est un fond
neutre, pas une image manquante, la page a l'air finie telle quelle.

Pour mettre ta photo à la place :

1. dépose ton image dans `assets/img/` (format `.jpg`, largeur ~1920 px, compressée)
2. dans `index.html`, remplace `src="assets/img/hero.svg"` par le nom de ton fichier

Le texte reste lisible : un voile sombre est appliqué automatiquement par-dessus l'image.

### Ajouter une vidéo

Section `VIDÉOS` de `index.html` (à rallumer d'abord). Duplique un bloc `<article>` et
remplace l'identifiant dans `data-yt="..."`.

L'identifiant se trouve dans l'URL YouTube : `youtube.com/watch?v=`**`dQw4w9WgXcQ`**

La miniature s'affiche automatiquement. La vidéo ne se charge qu'au clic du visiteur :
le site reste rapide et YouTube ne dépose aucun cookie avant.

### Ajouter une date de concert

Section `CONCERTS` de `index.html` (à rallumer d'abord). Duplique un `<li class="date">` :

```html
<li class="date" data-date="2026-10-04">
  <div class="date__when"><span class="date__day"></span><span class="date__month"></span></div>
  <div class="date__what">
    <h3>Nom de la salle</h3>
    <p>Ville, Pays</p>
  </div>
  <div class="date__go"><a class="btn btn--small" href="LIEN_BILLETTERIE" target="_blank" rel="noopener">Billetterie</a></div>
</li>
```

- `data-date` doit être au format **AAAA-MM-JJ**.
- Le jour et le mois affichés se remplissent automatiquement : ne les écris pas à la main.
- Le site classe tout seul la date dans « À venir » ou « Passés » selon la date du jour,
  et trie l'ensemble. Tu n'as jamais à réorganiser la liste.
- Sans billetterie, laisse `<div class="date__go"></div>` vide.

### Recevoir les messages du formulaire dans ta boîte Gmail

Par défaut, le formulaire ouvre le logiciel de messagerie du visiteur.
Ça marche partout, mais tous les visiteurs n'ont pas de logiciel mail configuré.

Pour recevoir les messages directement sur `mickasolo.sax@gmail.com`, sans serveur :

1. Crée un compte gratuit sur [formspree.io](https://formspree.io) et récupère ton identifiant de formulaire.
2. Dans `index.html`, sur la balise `<form id="contact-form">`, remplace :
   ```html
   data-mailto="mickasolo.sax@gmail.com"
   action="mailto:mickasolo.sax@gmail.com" method="post" enctype="text/plain"
   ```
   par :
   ```html
   action="https://formspree.io/f/TON_ID" method="POST"
   ```

Le JavaScript détecte le changement tout seul et envoie le message sans quitter la page.

---

## Mettre le site en ligne

Une seule fois, sur GitHub : **Settings → Pages → Source : Deploy from a branch → `main` / `(root)`**.

Ensuite, chaque `push` sur `main` met le site à jour automatiquement (compte 1 à 2 minutes) :

```bash
git add .
git commit -m "Ajout des dates de concert"
git push
```

---

## Ce qui est déjà prévu

- Responsive : téléphone, tablette, ordinateur.
- Accessible : navigation au clavier, lien d'évitement, contrastes, `alt` sur les images,
  animations désactivées si le système du visiteur le demande.
- Rapide : aucune bibliothèque externe, vidéos chargées seulement au clic.
- Référencement : titre, description et aperçu de partage sur les réseaux sociaux.
- Version imprimable propre.

## Structure

```
.
├── index.html              Tout le contenu du site
├── assets/
│   ├── css/style.css       Styles (couleurs en haut du fichier)
│   ├── js/main.js          Menu, filtres, galerie, formulaire
│   └── img/                Images
├── .nojekyll               Nécessaire pour GitHub Pages
└── README.md
```
