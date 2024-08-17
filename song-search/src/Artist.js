import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function Artist({ artist }) {
  const { adamid, name, avatar, weburl } = artist.artist;

  return (
    <Col md={3} sm={6} style={{ padding: "10px" }}>
      <Card key={adamid} style={{ width: "18rem" }}>
        {
          <Card.Img
            variant="top"
            src={avatar ? avatar : "https://placehold.co/286x288"}
            alt={`${name} artist poster`}
          />
        }
        {/* <Card.Img variant="top" src={avatar} alt={`${name} artist poster`} /> */}
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Button href={weburl} variant="primary">
            Listen Now
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}
