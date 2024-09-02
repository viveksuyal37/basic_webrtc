# WebRTC 
-WebRTC (Web Real-Time Communication) enables P2P communication between browsers (or other devices) for audio, video, and data sharing. Since it is p2p, that means no central server is required in order to establish a communicate. 
But we need a stun server to discover the public IP address and port of a peer behind NAT/firewall and a signaling server to exchange control messages (offers, answers, ICE candidates) to establish a connection.


# WebRTC Key Terminologies

## STUN (Session Traversal Utilities for NAT)
- **Purpose**: Helps discover the public IP address and port of a peer behind NAT/firewall.
- **How It Works**: Peer sends a request to a STUN server; server responds with public IP and port.
- **Use Case**: Useful for establishing direct connections when NAT allows.

## TURN (Traversal Using Relays around NAT)
- **Purpose**: Relays data between peers when a direct P2P connection is not possible due to restrictive NAT (firewalls).

## ICE (Interactive Connectivity Establishment)
- **Purpose**: Finds the best path to connect peers using STUN and TURN.
- **Components**:
  - **ICE Candidates**: Potential connection paths (public, private, relay addresses).
  - **ICE Gathering**: Collecting all ICE candidates.
  - **ICE Connectivity Check**: Testing candidate pairs to select the best one.

## SDP (Session Description Protocol)
- **Purpose**: Describes multimedia communication sessions (codecs, network info, etc.).
- **Components**:
  - **Media Descriptions**: Specifies media type, codec, encryption keys, etc.
  - **Connection Information**: Provides IP and port for media transmission.

## Offer
- **Purpose**: An SDP message sent by the initiating peer to propose a connection.
- **How It Works**: Encodes ICE candidates into SDP and sends to the other peer to start negotiation.

## Answer
- **Purpose**: An SDP message sent by the receiving peer in response to an offer.
- **How It Works**: Confirms or modifies the proposed media parameters and sends back to the initiator.

## Signaling
- **Purpose**: Exchanges control messages (offers, answers, ICE candidates) to establish a connection.
- **How It Works**: Managed outside WebRTC via WebSockets, HTTP, etc.

## PeerConnection
- **Purpose**: Manages the connection between peers, including media and data channels.
- **How It Works**: Uses methods like `createOffer()`, `createAnswer()`, `setLocalDescription()`.

## Data Channels
- **Purpose**: Allows sending arbitrary data (text, files, etc.) directly between peers.
- **How It Works**: `RTCDataChannel` enables bi-directional communication over WebRTC.

## MediaStream
- **Purpose**: Represents a stream of media content (audio/video).
- **How It Works**: Can contain multiple tracks (audio/video) and can be captured locally or received remotely.

## MediaTrack
- **Purpose**: Represents an individual audio or video track within a `MediaStream`.
- **How It Works**: Tracks can be independently controlled (muted, enabled/disabled).

## Codec
- **Purpose**: Compresses and decompresses audio/video data during transmission.
- **How It Works**: Codecs like VP8, VP9 (video), Opus (audio) are negotiated during the SDP exchange.

## Bandwidth Estimation (BWE)
- **Purpose**: Dynamically adjusts media bitrate based on network conditions.
- **How It Works**: Monitors network performance and adjusts media quality accordingly.

