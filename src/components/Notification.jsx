const Notification = ({ message, type }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type === "succeed" ? "succeed" : "error"}>{message}</div>
  );
};

export default Notification;
