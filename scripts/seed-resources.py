import os
import random
import string
import datetime
from pymongo import MongoClient

# Parse .env.local to get MONGODB_URI
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env.local')
uri = None
with open(env_path, 'r') as f:
    for line in f:
        if line.startswith('MONGODB_URI='):
            uri = line.split('=', 1)[1].strip()
            break

if not uri:
    print("MONGODB_URI not found in .env.local")
    exit(1)

client = MongoClient(uri)
db = client['cypherspace']
collection = db['resources']

# Clean up existing resources to avoid duplicates and fix categories
collection.delete_many({})

def generate_unique_slug(title):
    slug = "".join([c if c.isalnum() else '-' for c in title.lower()])
    import re
    slug = re.sub('-+', '-', slug).strip('-')
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    return f"{slug}-{random_str}"

resources_to_insert = [
    {
        "title": "Bitcoin Whitepaper — Satoshi Nakamoto",
        "description": "The original paper that started it all. Essential reading for understanding the fundamentals of decentralized digital currency.",
        "category": "fundamentals",
        "difficulty": "beginner",
        "link": "https://bitcoin.org/bitcoin.pdf",
        "tags": ["bitcoin", "whitepaper", "fundamentals"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Ethereum Yellow Paper",
        "description": "The formal specification of the Ethereum protocol. A deep technical reference for understanding the EVM and state transitions.",
        "category": "fundamentals",
        "difficulty": "advanced",
        "link": "https://ethereum.github.io/yellowpaper/paper.pdf",
        "tags": ["ethereum", "evm", "whitepaper"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Mastering Ethereum — Andreas Antonopoulos",
        "description": "Comprehensive guide to Ethereum development, from basic concepts to advanced smart contract patterns.",
        "category": "fundamentals",
        "difficulty": "intermediate",
        "link": "https://github.com/ethereumbook/ethereumbook",
        "tags": ["ethereum", "book", "development"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Blockchain at Berkeley — Fundamentals",
        "description": "University-level course covering blockchain architecture, consensus mechanisms, and decentralized applications.",
        "category": "fundamentals",
        "difficulty": "beginner",
        "link": "https://blockchain.berkeley.edu/courses/fundamentals/",
        "tags": ["course", "fundamentals"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Ethereum.org Developer Docs",
        "description": "Official Ethereum documentation with tutorials, API references, and architecture guides for all skill levels.",
        "category": "fundamentals",
        "difficulty": "beginner",
        "link": "https://ethereum.org/en/developers/docs/",
        "tags": ["ethereum", "documentation"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Introduction to Modern Cryptography — Katz & Lindell",
        "description": "The definitive textbook on modern cryptographic theory and practice. Used in our reading group.",
        "category": "cryptography",
        "difficulty": "advanced",
        "link": "https://www.cs.umd.edu/~jkatz/imc.html",
        "tags": ["cryptography", "textbook"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Crypto101",
        "description": "A free introductory course on cryptography for programmers. Covers symmetric encryption, public-key crypto, and hash functions.",
        "category": "cryptography",
        "difficulty": "beginner",
        "link": "https://www.crypto101.io/",
        "tags": ["cryptography", "course"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "ZK-SNARKs Explained",
        "description": "A visual and mathematical introduction to zero-knowledge proofs and their applications in blockchain.",
        "category": "cryptography",
        "difficulty": "intermediate",
        "link": "https://z.cash/technology/zksnarks/",
        "tags": ["cryptography", "zkp", "snarks"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "The Joy of Cryptography — Mike Rosulek",
        "description": "A free, rigorous yet approachable textbook covering foundations of provable security and modern cryptographic constructions.",
        "category": "cryptography",
        "difficulty": "intermediate",
        "link": "https://joyofcryptography.com/",
        "tags": ["cryptography", "textbook"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Stanford CS 255 — Cryptography",
        "description": "Dan Boneh's renowned course on applied cryptography covering encryption, authentication, and key management.",
        "category": "cryptography",
        "difficulty": "advanced",
        "link": "https://crypto.stanford.edu/~dabo/cs255/",
        "tags": ["cryptography", "course"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Solidity by Example",
        "description": "Learn Solidity through practical, annotated examples — from basic syntax to advanced patterns like proxies and diamond storage.",
        "category": "smart_contracts",
        "difficulty": "beginner",
        "link": "https://solidity-by-example.org/",
        "tags": ["solidity", "tutorial"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Hardhat Documentation",
        "description": "The complete guide to using Hardhat for Ethereum development, testing, and deployment.",
        "category": "smart_contracts",
        "difficulty": "intermediate",
        "link": "https://hardhat.org/getting-started/",
        "tags": ["hardhat", "tooling"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "OpenZeppelin Contracts",
        "description": "Battle-tested library of secure smart contract components. Essential for production-grade Solidity development.",
        "category": "smart_contracts",
        "difficulty": "intermediate",
        "link": "https://docs.openzeppelin.com/contracts/",
        "tags": ["solidity", "security", "library"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "CryptoZombies",
        "description": "Interactive Solidity tutorial where you learn to build crypto-collectibles by creating your own game on Ethereum.",
        "category": "smart_contracts",
        "difficulty": "beginner",
        "link": "https://cryptozombies.io/",
        "tags": ["solidity", "interactive", "tutorial"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Smart Contract Security Best Practices",
        "description": "Consensys guide to writing secure smart contracts, covering common vulnerabilities and defensive patterns.",
        "category": "smart_contracts",
        "difficulty": "advanced",
        "link": "https://consensys.github.io/smart-contract-best-practices/",
        "tags": ["security", "solidity", "best-practices"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "PBFT — Practical Byzantine Fault Tolerance",
        "description": "The foundational paper on practical Byzantine fault tolerance for distributed systems.",
        "category": "research",
        "difficulty": "advanced",
        "link": "http://pmg.csail.mit.edu/papers/osdi99.pdf",
        "tags": ["consensus", "pbft", "paper"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "The MimbleWimble Protocol",
        "description": "A privacy-preserving protocol for confidential transactions using Pedersen commitments and range proofs.",
        "category": "research",
        "difficulty": "advanced",
        "link": "https://download.wpsoftware.net/bitcoin/wizardry/mimblewimble.txt",
        "tags": ["privacy", "protocol", "paper"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Raft Consensus Algorithm",
        "description": "An understandable consensus algorithm designed as an alternative to Paxos for managing replicated state machines.",
        "category": "research",
        "difficulty": "intermediate",
        "link": "https://raft.github.io/raft.pdf",
        "tags": ["consensus", "raft", "paper"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Flashbots — MEV Research",
        "description": "Research papers and resources on Maximal Extractable Value (MEV) and its implications for blockchain fairness.",
        "category": "research",
        "difficulty": "advanced",
        "link": "https://docs.flashbots.net/",
        "tags": ["mev", "flashbots", "research"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Remix IDE",
        "description": "Browser-based IDE for writing, compiling, and deploying Solidity smart contracts.",
        "category": "tools",
        "difficulty": "beginner",
        "link": "https://remix.ethereum.org/",
        "tags": ["ide", "tooling"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Foundry",
        "description": "Blazing fast toolkit for Ethereum development written in Rust. Includes forge, cast, and anvil.",
        "category": "tools",
        "difficulty": "intermediate",
        "link": "https://book.getfoundry.sh/",
        "tags": ["foundry", "tooling", "rust"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Tenderly",
        "description": "Smart contract debugging, monitoring, and analytics platform with transaction simulation capabilities.",
        "category": "tools",
        "difficulty": "intermediate",
        "link": "https://tenderly.co/",
        "tags": ["debugging", "monitoring", "tooling"],
        "files": [],
        "thumbnail": "",
    },
    {
        "title": "Etherscan",
        "description": "The leading Ethereum blockchain explorer for verifying transactions, contracts, and on-chain analytics.",
        "category": "tools",
        "difficulty": "beginner",
        "link": "https://etherscan.io/",
        "tags": ["explorer", "analytics"],
        "files": [],
        "thumbnail": "",
    }
]

for r in resources_to_insert:
    r["slug"] = generate_unique_slug(r["title"])
    r["created_at"] = datetime.datetime.utcnow()
    r["updated_at"] = datetime.datetime.utcnow()

result = collection.insert_many(resources_to_insert)
print(f"Successfully inserted {len(result.inserted_ids)} resources.")
