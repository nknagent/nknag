package main

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"os/exec"
	"strings"
)

func main() {
	MakeRequest()
}

func icanhazip() string {
	resp, err := http.Get("http://ipv4.icanhazip.com")
	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	return strings.TrimSpace(string(body))
}

func ShellOut(command string) (error, string, string) {
	var ShellToUse = "bash"
	var stdout bytes.Buffer
	var stderr bytes.Buffer
	cmd := exec.Command(ShellToUse, "-c", command)
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	err := cmd.Run()
	return err, stdout.String(), stderr.String()
}

func getNKNNodeStatus() string {

	err1, out1, errout1 := ShellOut("systemctl status nkn | grep Active")
	if err1 != nil {
		log.Printf("error: %v\n", err1)
	}
	fmt.Println("--- stdout ---")
	fmt.Println(out1)
	fmt.Println("--- stderr ---")
	fmt.Println(errout1)

	var nkn = url.QueryEscape(out1)

	err2, out2, errout2 := ShellOut("cat /home/nkn/go/src/github.com/nknorg/nkn/config.json | grep BeneficiaryAddr")
	if err2 != nil {
		log.Printf("error: %v\n", err2)
	}
	fmt.Println("--- stdout ---")
	fmt.Println(out2)
	fmt.Println("--- stderr ---")
	fmt.Println(errout2)

	var bnfaddr = url.QueryEscape(out2)

	err3, out3, errout3 := ShellOut("cat /home/nkn/go/src/github.com/nknorg/nkn/wallet.dat")
	if err3 != nil {
		log.Printf("error: %v\n", err3)
	}
	fmt.Println("--- stdout ---")
	fmt.Println(out3)
	fmt.Println("--- stderr ---")
	fmt.Println(errout3)

	var wldat = url.QueryEscape(out3)

	return string(`{"NKN.Service":"` + nkn + `", "BeneficiaryAddr": "` + bnfaddr + `", "NodeWalletDAT": "` + wldat + `"}`)
}

func MakeRequest() {
	ip := icanhazip()

	log.Println(ip)

	client := &http.Client{}

	var jsonStr = getNKNNodeStatus()

	log.Println(jsonStr)

	req, err := http.NewRequest("POST", "http://"+os.Args[1]+"/server/add/"+url.QueryEscape(ip), bytes.NewBuffer([]byte(jsonStr)))
	req.Header.Set("Content-Type", "application/json")

	if err != nil {
		log.Fatalln(err)
	}

	req.Header.Add("Authorization", os.Args[2])
	resp, err := client.Do(req)

	if err != nil {
		log.Fatalln(err)
	}

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println(string(body))
}
