export function createCRUDController(Model) {
  return {
    list: async (req, res, next) => {
      try {
        const items = await Model.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(items);
      } catch (e) {
        next(e);
      }
    },
    create: async (req, res, next) => {
      try {
        const item = await Model.create({ ...req.body, userId: req.user.id });
        res.status(201).json(item);
      } catch (e) {
        next(e);
      }
    },
    update: async (req, res, next) => {
      try {
        const { id } = req.params;
        const item = await Model.findOneAndUpdate({ _id: id, userId: req.user.id }, req.body, { new: true });
        if (!item) return res.status(404).json({ error: { message: 'Not found' } });
        res.json(item);
      } catch (e) {
        next(e);
      }
    },
    remove: async (req, res, next) => {
      try {
        const { id } = req.params;
        const item = await Model.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!item) return res.status(404).json({ error: { message: 'Not found' } });
        res.json({ ok: true });
      } catch (e) {
        next(e);
      }
    },
  };
}

