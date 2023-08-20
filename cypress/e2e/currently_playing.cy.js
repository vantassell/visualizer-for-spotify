describe("login tests", () => {
  it("visits index without any login", () => {
    cy.visit("localhost:3000");
    // cy.get('[id=video-player]').should('be.visible');
    cy.get(".video-player").should("be.visible");
    cy.get(".new-sign-in").should("be.visible");
    cy.get(".go-to-visualizer").should("not.be.visible");
    cy.get(".sign-out-user").should("not.be.visible");
  });

  it("logs in", () => {
    cy.visit("localhost:3000");
    cy.get(".new-sign-in").click();
    cy.origin("https://accounts.spotify.com/en/login", () => {
      cy.get("#login-username").type("off.fairfax.test@gmail.com");
      cy.get("#login-password").type("asdfasdf1");
      cy.get("#login-button").click();
    });

    cy.origin("https://accounts.spotify.com/en/authorize", () => {
      cy.get("#privacy-policy").should("be.visible");
      cy.get('[data-testid="auth-accept"]').click();
    });
    cy.origin(
      "https://vantassell.github.io/visualizer-for-spotify-webapp",
      () => {
        cy.get(".new-sign-in").should("not.be.visible");
        cy.get(".sign-out-user").should("be.visible");
        cy.get(".go-to-visualizer").should("be.visible");
        cy.get(".go-to-visualizer").click();
      },
    );

    cy.origin(
      "https://vantassell.github.io/visualizer-for-spotify-webapp/visualizers",
      () => {
        cy.get(".trackInfo")
          .contains("Track: Me Porto Bonito")
          .should("be.visible");
        cy.get(".trackInfo")
          .contains("Artist: Bad Bunny, Chencho Corleone")
          .should("be.visible");
        cy.get(".trackInfo")
          .contains("Album: Un Verano Sin Ti")
          .should("be.visible");
        cy.get(".artworkContainer").should("be.visible");
        cy.get(".artwork")
          .should("have.attr", "src")
          .and(
            "equal",
            "https://i.scdn.co/image/ab67616d0000b27349d694203245f241a1bcaa72",
          );
        cy.get(".spotifyLogoContainer").should("be.visible");
        cy.get(".spotifyLogo").should("be.visible").click();
      },
    );
    cy.origin("https://open.spotify.com/track/6Sq7ltF9Qa7SNFBsV5Cogx", () => {
      cy.url().should(
        "eq",
        "https://open.spotify.com/track/6Sq7ltF9Qa7SNFBsV5Cogx",
      );
    });
  });
});
