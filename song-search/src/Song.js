import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

export default function Song({ song }) {
  const { key, title, subtitle, images, share } = song.track;

  return (
    <Col xl={3} lg={4} md={6} style={{ padding: "10px" }}>
      <Card key={key} style={{ width: "18rem" }}>
        <Card.Img
          variant="top"
          src={
            images.coverart ? images.coverart : "https://placehold.co/286x288"
          }
        />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Text>by {subtitle}</Card.Text>
          <a href={share.href} rel="noreferrer" target="_blank">
            <Button variant="primary">Listen Now</Button>
          </a>
        </Card.Body>
      </Card>
    </Col>
  );
}
