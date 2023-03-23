import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { useState } from "react";
export default function RulesPage() {
  const [side, setSide] = useState<string>("front");
  return (
    <div className={styles.home}>
      <Link href="/play" className="button">
        Back
      </Link>
      {(side === "front" && (
        <div
          style={{
            margin: "0 10%",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowY: "scroll",
            maxWidth: "100%",
            maxHeight: "80%",
          }}
        >
          <span>Here are the rules of the game:</span>
          <br></br>

          <span>
            Each player in turn rolls all six dice and checks to see if they
            have rolled any scoring dice or combinations. (
            <span
              className="score_link"
              onClick={() => {
                setSide("back");
              }}
            >
              See Scoring
            </span>{" "}
            ) Any dice that score may be set aside and then the player may
            choose to roll all the remaining dice. The player must set aside at
            least one scoring die of their choice if possible but is not
            required to set aside all scoring dice.
          </span>
          <span>
            Any scoring dice that are not set aside may be rerolled along with
            the non-scoring dice.
          </span>
          <span>
            If all six dice have been set aside for scoring (known as having
            “hot dice”), the player can choose to roll all six dice again and
            continue adding to their accumulated score or they can bank their
            points, end their turn, and pass the dice to the next player.
          </span>
          <span>
            A player may choose to begin their turn by rolling the dice
            remaining from the previous player’s turn (e.g., those dice that
            were not set aside for scoring from the previous player’s turn). If
            the player scores with any of the dice on the first roll, they
            receive the previously accumulated points.
          </span>
        </div>
      )) || (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "scroll",
            maxWidth: "100%",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="1" id="die-1">
              <li className="die-item" data-side="1">
                <span className="dot"></span>
              </li>
            </ol>{" "}
            <span style={{ marginLeft: "4rem" }}>OR</span>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span> One = 100 or Five = 50</span>
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="4" id="die-1">
              <li className="die-item" data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>

            <ol className="die-list even-roll" data-roll="4" id="die-1">
              <li className="die-item" data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="4" id="die-1">
              <li className="die-item" data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span>Three of a kind = 100 * number of dots</span>
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span>Four of a kind = 1000</span>
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span>Five of a kind = 2000</span>
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span>Six of a kind = 3000</span>
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="1" id="die-1">
              <li className="die-item" data-side="1">
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="2" id="die-1">
              <li className="die-item" data-side="2">
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="3" id="die-1">
              <li className="die-item" data-side="3">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="4" id="die-1">
              <li className="die-item" data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="6" id="die-1">
              <li className="die-item" data-side="6">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span>1-6 straight = 1500</span>
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="2" id="die-1">
              <li className="die-item" data-side="2">
                <span className="dot"></span> <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="2" id="die-1">
              <li className="die-item" data-side="2">
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="4" id="die-1">
              <li className="die-item" data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>

                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="4" id="die-1">
              <li className="die-item" data-side="4">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="6" id="die-1">
              <li className="die-item" data-side="6">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="6" id="die-1">
              <li className="die-item" data-side="6">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span>Three pairs = 1500</span>
          <div
            style={{
              display: "flex",
              transform: "scale(.25)",
            }}
          >
            <ol className="die-list even-roll" data-roll="2" id="die-1">
              <li className="die-item" data-side="2">
                <span className="dot"></span> <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="2" id="die-1">
              <li className="die-item" data-side="2">
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="2" id="die-1">
              <li className="die-item" data-side="2">
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
            <ol className="die-list even-roll" data-roll="5" id="die-1">
              <li className="die-item" data-side="5">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </li>
            </ol>
          </div>
          <span>Two triplets = 2500</span>
        </div>
      )}
    </div>
  );
}
