import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function Search({
  searchQuery,
  setSearchQuery,
  handleSearchQuery,
}) {
  return (
    <Form onSubmit={handleSearchQuery}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Enter Search Term"
          defaultValue={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
        />
        <Form.Text className="text-muted">
          You can search by Artist name, song title, or album name.
        </Form.Text>
      </Form.Group>
      <Button variant="primary" type="submit">
        Search
      </Button>
    </Form>
  );
}
