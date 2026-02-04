# REdoing the Vendors API

- All we need is
    - A way to get a "read model" of the list of vendors for the UI or whatever.

```json
[
    {
      "id": "b1d6f5a1-3f49-4b14-9b6b-0c1d0a1f0001",
      "name": "Microsoft"
    }
]
```

An "internal" way for the Catalog API to get this information to see if a vendor exists.


# A Couple Patterns in Distributed Applications

- Event Sourcing

- Command/Query Responsibility Segregation (CQRS)


## Not that you HAVE to do it this way. 

## This is actually how I write software. I think you should. It is awesome.


- You can optimize a database for either reading or writing. Any combination is a compromise.


- Eventual Consistency.
- Transactional Consistency.

Think your app as things that happen over time (Event) write 'em all down. 

If you keep a good log, you can answer about any question someone can come up with in the future.

The events become the "source" of your state.

