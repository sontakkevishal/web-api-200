# Adding an Item to the Software Catalog

(From Web API 100)

A member of the software center team may add a new item to the software catalog.

An item must be from a supported vendor.

Has a title, and a list of platforms supported - "Windows", "MacOs", "Linux". Each platform may support one or more versions of the software.



Operations:

```
- title
- vendor (reference)
- platforms
    - macos
        - versions []
    - windows
        - versions []
    - linux
        - version []
```

HTTP - based APIs

- Resources - a "thingy" - a concept we are expressing through our API. Have an identifier. (URI)
- Representations - the kind of data that we are sending or receiving in the "body" of the request and response.
- Methods (Verbs) - GET | POST | PUT | DELETE ... sometimes HEAD, etc.


scheme  origin / authority         path (to the resource)    [querystring arguments], [fragments]
GET https://softwarecenter.company.com/catalog?vendor=microsoft

// synchronous model - if you get a success status code here, it means the work is done.

```http
POST https://localhost:9000/catalog
Content-Type: application/json

{
    "tile": "Visual Studio Code",
    "vendor": "https://vendors.company.com/vendors/389389389"
}
```

What can go wrong here:

- title is bad. (require, already exists, etc.)
- vendor is required.
    - but what if that vendor doesn't exist?

Return a 400 - and tell them that it was a 404??

**Always prefer the semantics of the HTTP - including errors**

POST  https://softwarecenter.company.com/vendors/389389389/titles
Content-Type: application/json

{
    "title": "Visual Studio Code"
}


# First Sprint

- The vendor IS another API, owned by a team (or even company) other than ours.

