# Portfolio — Micka

Site vitrine pour ma carrière de musicien : parcours, vidéos, concerts, photos et contact.

Site statique en **HTML / CSS / JavaScript**, sans framework et sans étape de compilation.
Pas de Node, pas de `npm install` : on ouvre le fichier, on modifie, c'est en ligne.

**En ligne :** https://aedqsf.github.io/Portfolio_Micka/

---

## Voir le site sur mon ordinateur

Double-clique sur `index.html`. C'est tout.

Après chaque modification, enregistre le fichier et recharge la page dans le navigateur
(`Ctrl + F5` pour forcer le rechargement si tu ne vois pas le changement).

---

## Où modifier quoi

| Ce que tu veux changer | Fichier | Repère |
|---|---|---|
| Textes, dates, vidéos, liens | `index.html` | commentaires `A REMPLACER` / `POUR AJOUTER` |
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

### Mettre tes vraies photos

1. Dépose tes images dans `assets/img/` (format `.jpg`, largeur ~1600 px, compressées).
2. Dans `index.html`, remplace les `src="assets/img/xxx.svg"` par le nom de ton fichier.
3. Mets à jour le texte `alt="..."` : c'est ce que lisent Google et les lecteurs d'écran.

Les fichiers `.svg` fournis sont des images de remplacement : ils évitent que le site
paraisse cassé tant que tes vraies photos ne sont pas là.

### Ajouter une vidéo

Dans la section `VIDÉOS` de `index.html`, duplique un bloc `<article>` et remplace
l'identifiant dans `data-yt="..."`.

L'identifiant se trouve dans l'URL YouTube : `youtube.com/watch?v=**dQw4w9WgXcQ**`

La miniature s'affiche automatiquement. La vidéo ne se charge qu'au clic du visiteur :
le site reste rapide et YouTube ne dépose aucun cookie avant.

### Ajouter une date de concert

Dans la section `CONCERTS` de `index.html`, duplique un `<li class="date">` :

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
- Le jour et le mois affichés sont remplis automatiquement, ne les écris pas à la main.
- Le site classe tout seul la date dans « À venir » ou « Passés » selon la date du jour,
  et trie l'ensemble. Tu n'as jamais à réorganiser la liste.
- Sans billetterie, laisse `<div class="date__go"></div>` vide.

### Recevoir les messages du formulaire par e-mail

Par défaut, le formulaire ouvre le logiciel de messagerie du visiteur.
Ça marche partout, mais tous les visiteurs n'ont pas de logiciel mail configuré.

Pour recevoir les messages directement dans ta boîte, sans serveur :

1. Crée un compte gratuit sur [formspree.io](https://formspree.io) et récupère ton identifiant de formulaire.
2. Dans `index.html`, sur la balise `<form id="contact-form">`, remplace :
   ```html
   data-mailto="contact@micka.fr"
   action="mailto:contact@micka.fr" method="post" enctype="text/plain"
   ```
   par :
   ```html
   action="https://formspree.io/f/TON_ID" method="POST"
   ```

Le JavaScript détecte le changement tout seul et envoie le message sans quitter la page.

---

## Mettre à jour le site en ligne

Le site est hébergé par GitHub Pages. Chaque `push` sur la branche `main` met le site à
jour automatiquement (compte 1 à 2 minutes).

```bash
git add .
git commit -m "Mise à jour des dates de concert"
git push
```

---

## Ce qui est déjà prévu

- Responsive : téléphone, tablette, ordinateur.
- Accessible : navigation au clavier, lien d'évitement, contrastes, `alt` sur les images,
  animations désactivées si le système du visiteur le demande.
- Rapide : aucune bibliothèque externe, vidéos chargées seulement au clic.
- Référencement : titre, description et aperçu de partage sur les réseaux sociaux.
- Version imprimable propre (utile pour envoyer le CV en PDF depuis le navigateur).

## Structure

```
.
├── index.html              Toutes les pages/sections du site
├── assets/
│   ├── css/style.css       Styles (couleurs en haut du fichier)
│   ├── js/main.js          Menu, filtres, galerie, formulaire
│   └── img/                Images (à remplacer par les tiennes)
├── .nojekyll               Nécessaire pour GitHub Pages
└── README.md
```
