const reqControllerHelper = {
  updateRequestByUser(req, res, request) {
    const { title, description, type } = req.body;
    const requestUpdate = (
      titleUpdate = request.title,
      descriptionUpdate = request.description,
      typeUpdate = request.type,
      outdatedRequest
    ) => Object.assign(
      {},
      outdatedRequest,
      {
        title: titleUpdate,
        description: descriptionUpdate,
        type: typeUpdate
      }
    );
    const updatedRequest = requestUpdate(title, description, type, request);
    return updatedRequest;
  },
  updateRequestByAdmin(req, res, decoded, request, requests) {
  }
};

export default reqControllerHelper;
