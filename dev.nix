{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.nodejs
    pkgs.vsce
    pkgs.nodePackages.typescript
  ];
}