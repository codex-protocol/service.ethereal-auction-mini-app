# Codex Protocol | Currency Conversion Auction App

![](https://i.imgur.com/GQnot2b.jpg)

> Currency conversion mini-app for Codex Protocol's charity auction held at Ethereal Summit 2018

This app displays the artwork & live auction prices for the cryptocurrency-themed artwork auctioned off by Codex Protocol at Ethereal Summit 2018. There is an admin panel that allows you to choose the currently-displayed artwork, as well as it's current USD auction price. These changes are pushed to the viewing clients via [socket.io](https://socket.io/)

# Usage
1. Install dependencies with `npm install`
1. Run the application with `npm start`
1. Open [http://localhost:3002](http://localhost:3002)
1. In a separate tab, open [http://localhost:3002/admin.html](http://localhost:3002/admin.html)
1. Enter a new USD value on the admin page and it will show up on the index page with the current ETH / BTC exchange values.
